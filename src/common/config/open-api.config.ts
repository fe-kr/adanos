import { registerAs } from '@nestjs/config';

export interface OpenApiConfig {
  title: string;
  securityScheme: {
    type: 'http';
    scheme: string;
    bearerFormat: string;
    name: string;
    description: string;
    in: string;
  };
}

export default registerAs(
  'open-api',
  (): OpenApiConfig => ({
    title: 'Kalimba',
    securityScheme: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
  }),
);
