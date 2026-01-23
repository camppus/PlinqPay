import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class UpdateWidthdralDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: ['APPROVED', 'REJECTED'],
  })
  @IsEnum(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  @ApiProperty()
  @IsUrl()
  fileUrl: string | undefined;

  @IsOptional()
  @ApiProperty()
  @IsString()
  notes: string | undefined;
}
