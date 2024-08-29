import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AppConfig, GoogleOAuthConfig } from 'src/common/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const { clientId, clientSecret } =
      configService.get<GoogleOAuthConfig>('google-oauth');
    const { clientUrl } = configService.get<AppConfig>('app');

    super({
      clientID: clientId,
      clientSecret,
      callbackURL: clientUrl + '/api/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    { emails, photos, name: names }: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const email = emails[0].value;
    const avatarUrl = photos[0]?.value;
    const name = `${names.givenName} ${names.familyName}`;

    done(null, { name, email, avatarUrl });
  }
}
