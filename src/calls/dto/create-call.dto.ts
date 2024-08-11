import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCallDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  senderId: string;
}
