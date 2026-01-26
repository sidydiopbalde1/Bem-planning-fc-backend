import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    const clientID = configService.get<string>('google.clientId') || 'not-configured';
    const clientSecret = configService.get<string>('google.clientSecret') || 'not-configured';
    const callbackURL = configService.get<string>('google.callbackUrl') || 'http://localhost:3001/api/auth/google/callback';

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });

    if (clientID === 'not-configured') {
      this.logger.warn('Google OAuth non configuré. Définissez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET.');
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { emails, displayName } = profile;
    const email = emails?.[0]?.value;

    if (!email) {
      throw new Error('Email non disponible depuis Google');
    }

    return this.authService.validateGoogleUser({
      email,
      name: displayName,
    });
  }
}
