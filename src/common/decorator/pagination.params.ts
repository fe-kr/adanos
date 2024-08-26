import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface IPagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: IPagination & { totalPages: number };
}

export const PaginationParams = createParamDecorator(
  (_, ctx: ExecutionContext): IPagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string);
    const size = parseInt(req.query.size as string);

    if (isNaN(page) || isNaN(size) || page < 0 || size < 0 || size > 100) {
      throw new BadRequestException('Invalid pagination params');
    }

    return { page, limit: size, size, offset: page * size };
  },
);
