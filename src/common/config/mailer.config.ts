import { registerAs } from '@nestjs/config';
import { Transporter } from 'nodemailer';

export interface MailerConfig {
  transport: Transporter;
}

export default registerAs('mailer', () => ({
  transport: {
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  },
}));
