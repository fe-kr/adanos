import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class EmailMagicLinkDto {
  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;
}
