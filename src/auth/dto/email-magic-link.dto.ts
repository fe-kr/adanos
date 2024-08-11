import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailMagicLinkDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
}
