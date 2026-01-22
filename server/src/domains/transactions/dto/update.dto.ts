import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  gmt_create: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  amount: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  gmt_payment: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  notify_time: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  payerIdentity: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  role: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  input_charset: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  sign: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  notify_create: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  notify_id: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  notify_type: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  payeeIdentity: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  out_trade_no: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  inner_trade_no: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  @IsOptional()
  @IsString()
  gmt_close?: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  sign_type: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  status: string;
}
