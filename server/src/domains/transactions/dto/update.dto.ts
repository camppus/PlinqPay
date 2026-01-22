import { IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class UpdatePaymentDTO {
  @IsString()
  gmt_create: string;
  @IsNumberString()
  amount: string;
  @IsString()
  gmt_payment: string;
  @IsString()
  @Length(14, 14)
  notify_time: string;
  @IsString()
  payerIdentity: string;
  @IsString()
  role: string;
  @IsString()
  input_charset: string;
  @IsString()
  sign: string;
  @IsString()
  notify_create: string;
  @IsString()
  notify_id: string;
  @IsString()
  notify_type: string;
  @IsString()
  payeeIdentity: string;
  @IsString()
  out_trade_no: string;
  @IsString()
  inner_trade_no: string;
  @IsOptional()
  @IsString()
  gmt_close?: string;
  @IsString()
  sign_type: string;
  @IsString()
  status: string;
}
