import { IsEmail } from 'class-validator';

export class EmailMagicLinkDto {
  @IsEmail()
  destination: string;
}
