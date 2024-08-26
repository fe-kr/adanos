import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig, AuthConfig } from 'src/common/config';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailMagicLinkDto } from '../dto/email-magic-link.dto';
import { Request } from 'express';

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
      callbackUrl: clientUrl + '/sign-in/callback',
      sendMagicLink: async (
        destination: string,
        href: string,
        _: string,
        req: Request<EmailMagicLinkDto>,
      ) => {
        if (req.url.endsWith('email/register')) {
          await this.register(req.body);
        }
        await this.validate(destination);
        await mailerService.sendMail({
          // to: destination,
          to: process.env.MAIL_RECEIVER_STUB,
          subject: 'Kalimba verification',
          html: `<a href="${href}">Your Verification Link</a>`,
        });
      },
      verify: ({ destination }, callback) =>
        callback(null, this.validate(destination)),
    });
  }

  async validate(destination: string) {
    const user = await this.authService.validateUser(destination);

    return user;
  }

  async register(body: EmailMagicLinkDto) {
    const user = await this.authService.registerUser(body);

    return user;
  }
}
