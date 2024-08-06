import { join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig, AuthConfig } from 'src/common/config';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailMagicLinkDto } from '../dto/email-magic-link.dto';

@Injectable()
export class EmailMagicLinkStrategy extends PassportStrategy(
  Strategy,
  'email-magic-link',
) {
  constructor(
    private authService: AuthService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
    const { secret, expiresIn } = configService.get<AuthConfig>('auth').jwt;
    const { clientUrl } = configService.get<AppConfig>('app');

    super({
      secret,
      jwtOptions: { expiresIn },
      callbackUrl: join(clientUrl, '/sing-in/by-email/callback'),
      sendMagicLink: async (destination: string, href: string) => {
        await mailerService.sendMail({
          // to: destination,
          to: process.env.MAIL_RECEIVER_STUB,
          subject: 'Kalimba verification',
          html: `<a href="${href}">Your Verification Link</a>`,
        });
      },
      verify: (payload: EmailMagicLinkDto, callback) =>
        callback(null, this.validate(payload)),
    });
  }

  validate(payload: EmailMagicLinkDto) {
    const user = this.authService.validateUser(payload.destination);

    return user;
  }
}
