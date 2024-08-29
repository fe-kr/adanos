import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { parse, join, extname as ext } from 'path';
import { unlink } from 'fs';
import * as sharp from 'sharp';
import { FileUploadConfig } from '../config';

@Injectable()
export class ImageResizePipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  constructor(private configService: ConfigService) {}

  async transform(image: Express.Multer.File): Promise<string> {
    const { dest } = this.configService.get<FileUploadConfig>('file-upload');
    const filename = `${nanoid()}${ext(image.originalname)}`;
    const pathToOriginalFile = join(dest, parse(image.path).base);
    const pathToFile = join(dest, filename);

    await sharp(image.path)
      .resize({
        fit: sharp.fit.contain,
        width: 800,
      })
      .toFile(pathToFile);

    unlink(pathToOriginalFile, () => {});

    return pathToFile;
  }
}
