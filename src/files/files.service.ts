import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { unlink } from 'node:fs';
import { parse, join } from 'node:path';
import * as sharp from 'sharp';
import { FileUploadConfig } from 'src/common/config';

@Injectable()
export class FilesService {
  constructor(private configService: ConfigService) {}

  async uploadImage(userId: string, image: Express.Multer.File) {
    const { dest, preservedPath } =
      this.configService.get<FileUploadConfig>('file-upload');
    const filename = `image-${userId}-${nanoid()}.webp`;
    const pathToFile = join(dest, filename);

    await sharp(image.path)
      .resize({
        fit: sharp.fit.contain,
        width: 800,
      })
      .toFile(pathToFile);

    this.deleteFile(parse(image.path).base);

    return preservedPath ? `${preservedPath}/${filename}` : pathToFile;
  }

  deleteFile(filename: string) {
    const { dest } = this.configService.get<FileUploadConfig>('file-upload');

    return unlink(join(dest, filename), (err) => Promise.reject(err));
  }
}
