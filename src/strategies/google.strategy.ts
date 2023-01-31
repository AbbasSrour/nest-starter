import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { VerifyCallback } from 'passport-google-oauth2';
import { Strategy } from 'passport-google-oauth2';
import type { Profile } from 'passport-google-oauth20';

import type { SocialProfileDto } from '@modules/auth/dto/social-profile.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('google.oAuth.clientID'),
      clientSecret: configService.getOrThrow('google.oAuth.clientSecret'),
      callbackURL: configService.getOrThrow('google.oAuth.callbackUrl'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<VerifyCallback> {
    const { name, emails, photos } = profile;

    if (!emails || !name) {
      return null;
    }

    const user: SocialProfileDto = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: photos && photos[0].value,
    };

    done(null, user);
  }
}
