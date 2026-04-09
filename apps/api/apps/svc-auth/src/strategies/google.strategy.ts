import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { SvcAuthService } from '../svc-auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: SvcAuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const { id, displayName, emails, photos } = profile;

      const email = emails?.[0]?.value;
      if (!email) {
        return done(new UnauthorizedException('Google account has no email'));
      }

      const user = await this.authService.findUserByEmail(email);

      if (user) {
        return done(null, user);
      }

      const tempSecret = process.env.JWT_TEMP_SECRET;
      if (!tempSecret) {
        return done(new Error('JWT_TEMP_SECRET not set'));
      }

      const tempToken = jwt.sign(
        {
          googleID: id,
          email,
          fullName: displayName,
          image: photos?.[0]?.value,
        },
        tempSecret,
        { expiresIn: '15m' },
      );

      return done(null, { tempToken });
    } catch (error) {
      return done(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
