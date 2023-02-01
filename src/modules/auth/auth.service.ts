import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '@common/abstract/utils';
import { ApiConfigService } from '@common/config/api-config.service';
import type { RoleType } from '@constants';
import { TokenType } from '@constants';
import { UserNotFoundException } from '@exceptions';
import { AlreadyVerifiedError } from '@exceptions/verification.exception';
import type { ITokenPayload } from '@interfaces/token-payload.interface';
import { EncryptedTokenPayloadBo } from '@modules/auth/bo/encrypted-token.payload.bo';
import { PasswordResetTokenPayloadBo } from '@modules/auth/bo/password-reset-token.payload.bo';
import { RefreshTokenPayloadBo } from '@modules/auth/bo/refresh-token.payload.bo';
import type { ResetPasswordBo } from '@modules/auth/bo/reset-password.bo';
import type { SocialProfileDto } from '@modules/auth/dto/social-profile.dto';
import { GeneratorProvider } from '@providers';

import { AccessTokenPayloadBo } from './bo/access-token.payload.bo';
import type { LoginDto } from './dto/login.dto';
import type { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('Auth Service');

  constructor(
    private readonly jwtService: JwtService,
    private readonly apiConfigService: ApiConfigService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  /**
   * @CreateAccessToken
   * @description creates access token
   * @param data
   */
  async createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<AccessTokenPayloadBo> {
    return new AccessTokenPayloadBo({
      expiresIn: this.apiConfigService.getOrThrow<number>(
        'jwt.accessToken.expiration'
      ),
      accessToken: await this.jwtService.signAsync(
        {
          userId: data.userId,
          type: TokenType.ACCESS_TOKEN,
          role: data.role,
        },
        {
          privateKey: this.apiConfigService.get<string>(
            'jwt.accessToken.privateKey'
          ),
          expiresIn: Number.parseInt(
            this.apiConfigService.get<string>('jwt.accessToken.expiration') ||
              '',
            10
          ),
          algorithm: 'RS256',
        }
      ),
    });
  }

  /**
   * @createRefreshToken
   * @description creates and return refresh token and its expiration time
   * @param data
   */
  async createRefreshToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<RefreshTokenPayloadBo> {
    return new RefreshTokenPayloadBo({
      expiresIn: this.apiConfigService.getOrThrow<number>(
        'jwt.refreshToken.expiration'
      ),
      refreshToken: await this.jwtService.signAsync(
        {
          userId: data.userId,
          type: TokenType.REFRESH_TOKEN,
          role: data.role,
        },
        {
          privateKey: this.apiConfigService.getOrThrow<string>(
            'jwt.refreshToken.privateKey'
          ),
          expiresIn: this.apiConfigService.getOrThrow<number>(
            'jwt.refreshToken.expiration'
          ),
          algorithm: 'RS256',
        }
      ),
    });
  }

  /**
   * @encryptedToken
   * @description creates an encrypted token for email verification
   * @param role
   * @param userId
   * @param tokenType
   */
  async encryptedToken(
    role: RoleType,
    userId: Uuid,
    tokenType: TokenType
  ): Promise<EncryptedTokenPayloadBo> {
    return new EncryptedTokenPayloadBo({
      expiresIn: this.apiConfigService.getOrThrow(
        'security.encToken.expiration'
      ),
      token: await this.jwtService.signAsync(
        {
          userId,
          type: tokenType,
          role,
        },
        {
          privateKey: this.apiConfigService.getOrThrow<string>(
            'security.encToken.privateKey'
          ),
          expiresIn: this.apiConfigService.getOrThrow<number>(
            'security.encToken.expiration'
          ),
          algorithm: 'RS256',
        }
      ),
    });
  }

  /**
   * @passwordResetToken
   * @description creates a password reset token with the secret as the old password hash
   * to prevent the token to be used to reset the password multiple times
   * @param data
   */
  async passwordResetToken({
    email,
  }: {
    email: string;
  }): Promise<PasswordResetTokenPayloadBo> {
    const user = await this.userService.findByEmail(email).catch(() => {
      throw new UserNotFoundException();
    });

    const expiration = this.apiConfigService.getOrThrow<string>(
      'security.encToken.expiration'
    );

    const token = await this.jwtService.signAsync(
      {
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
        role: user.role,
      },
      {
        secret: user.password,
        expiresIn: expiration,
        algorithm: 'HS256',
      }
    );

    return new PasswordResetTokenPayloadBo({ token, expiration, user });
  }

  /**
   * @resetPassword
   * @description this takes an email, password, and the reset token, verifies the
   * token and resets the password
   * @param data
   */
  async resetPassword(data: ResetPasswordBo): Promise<void> {
    const { userId } = this.jwtService.decode(data.token) as ITokenPayload;

    const user = await this.userService.getUser(userId).catch(() => {
      throw new UserNotFoundException();
    });

    try {
      await this.jwtService.verify(data.token, {
        secret: user.password,
        algorithms: ['HS256'],
      });
    } catch (error: unknown) {
      throw new BadRequestException('Invalid Token', { cause: <Error>error });
    }

    await this.userService.updateUser(user.id, { password: data.password });
  }

  async verifyUserEmail(token: string) {
    const { userId } = await this.jwtService.verifyAsync<ITokenPayload>(token, {
      algorithms: ['RS256'],
      publicKey: this.apiConfigService.getOrThrow(
        'security.encToken.publicKey'
      ),
    });

    const user = await this.userService.getUser(userId);

    if (user.isEmailVerified) {
      throw new AlreadyVerifiedError();
    }

    await this.userService.updateUser(userId, { isEmailVerified: true });
  }

  /**
   * @validateUser
   * @description validate the user
   * @param userLoginDto
   */
  async validateUser(userLoginDto: LoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      email: userLoginDto.email,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password
    );

    if (!isPasswordValid) {
      throw new BadRequestException();
    }

    if (!user?.isEmailVerified) {
      throw new ForbiddenException();
    }

    return user;
  }

  /**
   * @socialProfileCreate
   * @param socialProfileDto
   */
  async socialProfileCreate(
    socialProfileDto: SocialProfileDto
  ): Promise<UserEntity> {
    let user = await this.userService
      .findByEmail(socialProfileDto.email)
      .catch(() => null);

    if (!user) {
      user = await this.userService.createUser({
        ...socialProfileDto,
        password: GeneratorProvider.generatePassword(),
        isEmailVerified: true,
      });
    }

    return user;
  }
}
