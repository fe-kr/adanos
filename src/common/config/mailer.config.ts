import { registerAs } from '@nestjs/config';

export interface MailerConfig {
  transport: {
    service: string;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export default registerAs(
  'mailer',
  (): MailerConfig => ({
    transport: {
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    },
  }),
);
