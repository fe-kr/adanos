import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfig, OpenApiConfig } from './common/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.setGlobalPrefix(appConfig.globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(process.cwd(), appConfig.serveStaticRoot), {
    prefix: `/${appConfig.serveStaticRoot}`,
  });
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
    .addBasicAuth(openApiConfig.securityScheme, 'JWT')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${appConfig.globalPrefix}`, app, document, {
    customSiteTitle: openApiConfig.title,
  });
}
