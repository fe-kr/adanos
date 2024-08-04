import { registerAs } from '@nestjs/config';

export interface AppConfig {
  globalPrefix: string;
}

export default registerAs(
  'app',
  (): AppConfig => ({
    globalPrefix: 'api',
  }),
);
