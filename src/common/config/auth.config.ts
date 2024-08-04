import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export default registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      secret: process.env.JWT_SECRET_KEY || '12345',
      expiresIn: process.env.JWT_EXPIRATION_TIME || '1h',
    },
  }),
);
