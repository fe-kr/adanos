import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from 'src/common/config';

@Injectable()
export class EmailMagicLinkStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(EmailMagicLinkStrategy.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const { secret, expiresIn } = configService.get<AuthConfig>('auth').jwt;

    super({
      secret,
      jwtOptions: { expiresIn },
      callbackUrl: '/login/by-email/callback',
      sendMagicLink: async (destination, href) => {
        // TODO: send email
        this.logger.debug(`sending email to ${destination} with Link ${href}`);
      },
      verify: async (payload, callback) => {
        return callback(null, this.validate(payload));
      },
    });
  }

  validate(payload: { destination: string }) {
    const user = this.authService.validateUser(payload.destination);

    return user;
  }
}
