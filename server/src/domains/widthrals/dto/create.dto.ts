import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateWidthrawlDto {
  @IsNumber()
  @ApiProperty()
  @IsPositive()
  @Min(5000)
  amount: number;
}
