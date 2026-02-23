import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  StrategyOptions,
} from 'passport-google-oauth20';
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
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;

    const user = await this.authService.findUserByEmail(email);

    if (user) {
      return done(null, user);
    }

    const tempToken = jwt.sign(
      {
        googleID: id,
        email,
        fullName: displayName,
        image: photos?.[0]?.value,
      },
      process.env.JWT_TEMP_SECRET!,
      { expiresIn: '15m' },
    );

    return done(null, { tempToken });
  }
}
