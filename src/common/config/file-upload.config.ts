import { registerAs } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { join } from 'node:path';

export interface FileUploadConfig extends MulterOptions {
  dest?: string;
  preservedPath?: string;
}

export default registerAs(
  'file-upload',
  (): FileUploadConfig => ({
    dest: join(process.cwd(), process.env.SERVE_STATIC_ROOT),
    preservedPath:
      process.env.NODE_ENV === 'development'
        ? `http://localhost:${process.env.APP_PORT}/${process.env.SERVE_STATIC_ROOT}`
        : join(process.cwd(), process.env.SERVE_STATIC_ROOT),
  }),
);
