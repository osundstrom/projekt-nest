import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
   ): Promise<any> {
    const { name, emails, photos, id: googleId } = profile;
    const userEmail = emails?.[0]?.value;
    const userFirstName = name?.givenName;
    const userLastName = name?.familyName;
    const userProfilePhoto = photos?.[0]?.value;

    if (!userEmail) {
      return done(new Error("kan ej hitta google konto"), null);
    }

    try {
      const user = await this.authService.validateOAuthLogin({
        googleId,
        email: userEmail,
        firstName: userFirstName,
        lastName: userLastName,
        imageUrl: userProfilePhoto,
      });
      done(null, user);
    } catch (error) {
      done(error, false);
    }}}