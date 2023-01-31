import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { RoleType } from '@constants';
import { TokenType } from '@constants';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('jwt.refreshToken.publicKey'),
    });
  }

  async validate(args: { userId: Uuid; role: RoleType; type: TokenType }) {
    if (args.type !== TokenType.REFRESH_TOKEN) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({
      id: args.userId as never,
      role: args.role,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
