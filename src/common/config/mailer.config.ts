import { registerAs } from '@nestjs/config';

export interface MailerConfig {}

export default registerAs('mailer', (): MailerConfig => ({}));
