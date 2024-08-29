import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds the limit of 5MB');
    }

    return file;
  }
}
