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
    // google oauth id, secret och callback
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"], //data från google
    });
  }

  //vid autensierad användare
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
   ): Promise<any> {
    //hämtar datan vi vill ha från google
    const { name, emails, photos, id: googleId } = profile;
    const userEmail = emails?.[0]?.value;
    const userFirstName = name?.givenName;
    const userLastName = name?.familyName;
    const userProfilePhoto = photos?.[0]?.value;

    //Om ingen epost (fel vid inlogg)
    if (!userEmail) {
      return done(new Error("kan ej hitta google konto"), null);
    }

    //validera användare alternativ skapa ny användare
    try {
      const user = await this.authService.validateOAuthLogin({
        googleId,
        email: userEmail,
        firstName: userFirstName,
        lastName: userLastName,
        imageUrl: userProfilePhoto,
      });

      done(null, user); //om godkänd
    } catch (error) {
      done(error, false); // om fel
    }}}