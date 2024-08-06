import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfig, OpenApiConfig } from './common/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.setGlobalPrefix(appConfig.globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: process.env.APP_CLIENT_URL });

  setupOpenAPI(app);

  await app.listen(appConfig.port);

  console.log(
    '\nServer started at:',
    `\x1b[36m http://localhost:${appConfig.port}/${appConfig.globalPrefix} \x1b[0m`,
  );
}

bootstrap();

function setupOpenAPI(app: INestApplication) {
  const configService = app.get(ConfigService);
  const openApiConfig = configService.get<OpenApiConfig>('open-api');
  const appConfig = configService.get<AppConfig>('app');

  const config = new DocumentBuilder()
    .setTitle(openApiConfig.title)
    .addBasicAuth(openApiConfig.securityScheme)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${appConfig.globalPrefix}`, app, document, {
    customSiteTitle: openApiConfig.title,
  });
}
