import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileUploadConfig } from 'src/common/config';
import { diskStorage } from 'multer';
import { extname as ext } from 'node:path';
import { nanoid } from 'nanoid';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<FileUploadConfig>('file-upload').dest,
          filename: (_, { originalname }, cb) =>
            cb(null, `${nanoid()}${ext(originalname)}`),
        }),
      }),
    }),
  ],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
