import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateWidthrawlDto {
  @IsNumber()
  @ApiProperty()
  @IsPositive()
  @Min(5_000)
  amount: number;
}
