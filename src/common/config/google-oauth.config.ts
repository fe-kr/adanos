import { registerAs } from '@nestjs/config';

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
}

export default registerAs(
  'google-oauth',
  (): GoogleOAuthConfig => ({
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  }),
);
