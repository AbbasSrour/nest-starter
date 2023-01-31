import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { RoleType } from '@constants';
import { TokenType } from '@constants';
import type { UserEntity } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access'
) {
  constructor(
    private readonly configService: ConfigService,
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>(
        'jwt.accessToken.publicKey'
      ),
      algorithms: ['RS256'],
      ignoreExpiration: false,
    });
  }

  async validate(args: {
    userId: Uuid;
    role: RoleType;
    type: TokenType;
  }): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException('Invalid Token');
    }

    const user = await this.userService.findOne({
      // FIXME: issue with type casts
      id: args.userId as never,
      role: args.role,
    });

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    return user;
  }
}
