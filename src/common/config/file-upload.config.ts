import { registerAs } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { join, extname as ext } from 'node:path';

export interface FileUploadConfig extends MulterOptions {
  dest?: string;
}

export default registerAs(
  'file-upload',
  (): FileUploadConfig => ({
    dest: join(process.cwd(), process.env.SERVE_STATIC_ROOT),
    storage: diskStorage({
      destination: join(process.cwd(), process.env.SERVE_STATIC_ROOT),
      filename: (_, { originalname: name }, cb) => {
        cb(null, `${nanoid()}${ext(name)}`);
      },
    }),
  }),
);
