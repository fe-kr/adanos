import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  name: string;
  globalPrefix: string;
  clientUrl: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.APP_PORT),
    name: process.env.APP_NAME,
    clientUrl: process.env.APP_CLIENT_URL,
    globalPrefix: process.env.APP_GLOBAL_PREFIX,
  }),
);
