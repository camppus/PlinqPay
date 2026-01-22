import { ApiProperty } from '@nestjs/swagger';
import { IsIBAN, IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletDTO {
  @ApiProperty({
    title: 'Nome do proprietário',
  })
  @IsString()
  @IsNotEmpty()
  walletHolder: string;
  @IsIBAN()
  @IsNotEmpty()
  @ApiProperty()
  iban: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  bank: string;
}
