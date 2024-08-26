import { PickType } from '@nestjs/swagger';
import { EmailMagicLinkDto } from './email-magic-link.dto';

export class EmailMagicLinkVerifyDto extends PickType(EmailMagicLinkDto, [
  'email',
]) {}
