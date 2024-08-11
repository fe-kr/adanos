import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateCallDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDateString()
  endedAt: Date;
}
