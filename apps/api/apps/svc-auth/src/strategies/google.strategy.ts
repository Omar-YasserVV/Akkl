import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { SvcAuthService } from '../svc-auth.service';
import * as jwt from 'jsonwebtoken';

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
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, displayName, emails, photos } = profile;

    if (!displayName) {
      throw new UnauthorizedException('Google account has no display name');
    }

    const email = emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }

    const user = await this.authService.findUserByEmail(email);

    if (user) {
      done(null, user);
      return;
    }

    if (!process.env.JWT_TEMP_SECRET) {
      throw new Error('JWT_TEMP_SECRET not set');
    }

    const tempToken = jwt.sign(
      {
        googleID: id,
        email,
        fullName: displayName,
        image: photos?.[0]?.value,
      },
      process.env.JWT_TEMP_SECRET,
      { expiresIn: '15m' },
    );

    done(null, { tempToken });
  }
}
