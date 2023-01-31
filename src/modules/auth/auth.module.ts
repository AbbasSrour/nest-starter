import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MailerModule } from '@common/mailer/mailer.module';
import { GoogleStrategy } from '@strategies';
import { AccessTokenStrategy } from '@strategies/access-token.strategy';
import { FacebookStrategy } from '@strategies/facebook.strategy';
import { PublicStrategy } from '@strategies/public.strategy';
import { JwtRefreshStrategy } from '@strategies/refresh-token.strategy';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        signOptions: {
          algorithm: 'RS256',
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
    }),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    PublicStrategy,
    GoogleStrategy,
    FacebookStrategy,
    JwtRefreshStrategy,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
