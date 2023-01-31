import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Profile } from 'passport-facebook';
import { Strategy } from 'passport-facebook';
import type { VerifyCallback } from 'passport-google-oauth2';

import type { SocialProfileDto } from '@modules/auth/dto/social-profile.dto';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('facebook.oAuth.clientID'),
      clientSecret: configService.getOrThrow('facebook.oAuth.clientSecret'),
      callbackURL: configService.getOrThrow('facebook.oAuth.callbackUrl'),
      scope: 'email',
      profileFields: ['emails', 'name', 'photos'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<VerifyCallback> {
    const { name, emails, photos } = profile;

    console.log(profile);

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
