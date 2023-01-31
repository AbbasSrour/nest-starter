import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { EntityNotFoundError } from 'typeorm';

import { MailerService } from '@common/mailer/mailer.service';
import { RoleType, TokenType } from '@constants';
import { ApiFile, Auth, AuthUser } from '@decorators';
import {
  JWTExpiredTokenException,
  JWTInvalidTokenException,
} from '@exceptions/jwt.exception';
import { AlreadyVerifiedError } from '@exceptions/verification.exception';
import { FacebookOAuthGuard } from '@guards/facebook.guard';
import { GoogleOAuthGuard } from '@guards/google.guard';
import { IFile } from '@interfaces';
import { AccessTokenPayloadBo } from '@modules/auth/bo/access-token.payload.bo';
import { ResetPasswordBo } from '@modules/auth/bo/reset-password.bo';
import { ForgotPasswordDto } from '@modules/auth/dto/forgot-password.dto';
import { ForgotPasswordPayloadDto } from '@modules/auth/dto/forgot-password.payload.dto';
import { ResetPasswordDto } from '@modules/auth/dto/reset-password.dto';
import { SendVerificationEmailDto } from '@modules/auth/dto/send-verification-email.dto';
import { SocialProfileDto } from '@modules/auth/dto/social-profile.dto';
import { SocialProfilePayloadDto } from '@modules/auth/dto/social-profile.payload.dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginPayloadDto } from './dto/login.payload.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserDto } from '../user/dto/user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  /**
   * @getCurrentUser
   * @description get current user info
   * @param user
   */
  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }

  /**
   * @userRegister
   * @description takes a user registration and an optional image and registers the user
   * @param userRegisterDto
   * @param file
   */
  @Version('1')
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  @ApiFile({ name: 'avatar' })
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() file?: IFile
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(
      userRegisterDto,
      file
    );

    return createdUser.toDto({
      isActive: true,
    });
  }

  /**
   * @userLogin
   * @description endpoint for logging in the user the normal way
   * @param userLoginDto
   */
  @Version('1')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access and refresh tokens',
  })
  async userLogin(@Body() userLoginDto: LoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const access = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: userEntity.role,
    });

    const refresh = await this.authService.createRefreshToken({
      userId: userEntity.id,
      role: userEntity.role,
    });

    return new LoginPayloadDto(userEntity.toDto(), access, refresh);
  }

  /**
   * @refreshToken
   * @description returns a new access token if the refresh token is valid
   * @param user
   */
  @Version('1')
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenPayloadBo, description: 'Access Token' })
  @Auth([RoleType.USER, RoleType.ADMIN], { refresh: true })
  async refreshToken(
    @AuthUser() user: UserEntity
  ): Promise<AccessTokenPayloadBo> {
    return this.authService.createAccessToken({
      role: user.role,
      userId: user.id,
    });
  }

  /**
   * @sendVerificationEmail
   * @return {Promise<void>}
   */
  @Version('1')
  @Post('email/send-verification')
  @HttpCode(HttpStatus.OK)
  @Auth([], { public: true })
  @ApiOkResponse({})
  async sendVerificationEmail(@Body() dto: SendVerificationEmailDto) {
    const user = await this.userService.findByUsernameOrEmail({
      email: dto.email,
    });

    try {
      const { token } = await this.authService.encryptedToken(
        RoleType.USER,
        user.id,
        TokenType.EMAIL_VERIFICATION
      );

      await this.mailerService.sendVerifyEmailMail(
        user.firstName,
        user.email,
        token
      );
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException(
        'Could not send email try again later'
      );
    }
  }

  /**
   * @verifyEmail
   * @return {Promise<void>}
   */
  @Version('1')
  @Get('email/verify/:token')
  @HttpCode(HttpStatus.OK)
  @Auth([], { public: true })
  @ApiOkResponse({})
  async verifyEmail(@Param('token') token: string) {
    try {
      await this.authService.verifyUserEmail(token);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new BadRequestException("User doesn't exist");
      } else if (error instanceof TokenExpiredError) {
        throw new JWTExpiredTokenException();
      } else if (error instanceof JsonWebTokenError) {
        throw new JWTInvalidTokenException();
      } else if (error instanceof AlreadyVerifiedError) {
        throw new BadRequestException(error.message);
      } else {
        this.logger.error(error);

        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * @forgotPassword
   * @description sends an email with a link that contains an address to the frontend
   * with the token as a req param for inserting the new password
   * @param forgotPasswordDto
   */
  @Version('1')
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Auth([], { public: true })
  @ApiOkResponse({ description: 'email was sent to the user' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<ForgotPasswordPayloadDto> {
    const { user, token, expiration } =
      await this.authService.passwordResetToken(forgotPasswordDto);

    try {
      await this.mailerService.sendResetPasswordMail(
        user.firstName,
        user.email,
        token
      );
    } catch {
      throw new InternalServerErrorException(
        'Could not send email try again later'
      );
    }

    return new ForgotPasswordPayloadDto({ token, expiration });
  }

  /**
   * @resetPassword
   * @description verifies the password reset token and resets the password
   * @param resetPasswordDto
   */
  @Version('1')
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Auth([], { public: true })
  @ApiOkResponse({ description: 'reset password successfully' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<void> {
    return this.authService.resetPassword(
      plainToClass(ResetPasswordBo, resetPasswordDto)
    );
  }

  @Version('1')
  @Get('phone/verify')

  /**
   * @googleAuth
   * @description endpoint for logging in the user through Google and redirecting
   * @return {Promise<void>}
   */
  @Version('1')
  @Get('google')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  /**
   * @googleRedirect
   * @description google redirect and returns the data in the strategy
   * @return {Promise<SocialProfilePayloadDto>}
   */
  @Version('1')
  @Get('google/redirect')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SocialProfileDto,
    description: 'User info with access and refresh tokens',
  })
  @UseGuards(GoogleOAuthGuard)
  async googleRedirect(
    @AuthUser() profile: SocialProfileDto
  ): Promise<SocialProfilePayloadDto> {
    const user = await this.authService.socialProfileCreate(profile);
    const access = await this.authService.createAccessToken({
      role: user.role,
      userId: user.id,
    });
    const refresh = await this.authService.createRefreshToken({
      role: user.role,
      userId: user.id,
    });

    return new SocialProfilePayloadDto(user.toDto(), access, refresh);
  }

  /**
   * @facebookAuth
   * @description endpoint for logging in the user through facebook and redirecting
   * @return {Promise<void>}
   */
  @Version('1')
  @Get('facebook')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @UseGuards(FacebookOAuthGuard)
  async facebookAuth() {}

  /**
   * @facebookRedirect
   * @description facebook redirect and returns the data in the strategy
   * @param {SocialProfileDto} profile
   * @return {Promise<SocialProfilePayloadDto>}
   */
  @Version('1')
  @Get('facebook/redirect')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SocialProfileDto,
    description: 'User info with access and refresh tokens',
  })
  @UseGuards(FacebookOAuthGuard)
  async facebookRedirect(@AuthUser() profile: SocialProfileDto) {
    const user = await this.authService.socialProfileCreate(profile);
    const access = await this.authService.createAccessToken({
      role: user.role,
      userId: user.id,
    });
    const refresh = await this.authService.createRefreshToken({
      role: user.role,
      userId: user.id,
    });

    return new SocialProfilePayloadDto(user.toDto(), access, refresh);
  }
}
