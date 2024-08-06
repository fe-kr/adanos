import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class EmailMagicLinkAuthGuard extends AuthGuard('email-magic-link') {}
