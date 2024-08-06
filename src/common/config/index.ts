import appConfig from './app.config';
import databaseConfig from './database.config';
import openApiConfig from './open-api.config';
import authConfig from './auth.config';
import mailerConfig from './mailer.config';
import googleOauthConfig from './google-oauth.config';

export { AppConfig } from './app.config';
export { AuthConfig } from './auth.config';
export { MailerConfig } from './mailer.config';
export { OpenApiConfig } from './open-api.config';
export { GoogleOAuthConfig } from './google-oauth.config';

export const globalConfigs = [
  appConfig,
  authConfig,
  databaseConfig,
  googleOauthConfig,
  mailerConfig,
  openApiConfig,
];
