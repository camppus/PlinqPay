import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateTenantDTO {
  @ApiProperty({
    example: 'empresa@email.com',
    description: 'Email da empresa',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Tech Solutions',
    description: 'Nome ou título da empresa',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '+244923456789',
    description: 'Telefone da empresa',
  })
  @IsPhoneNumber('AO')
  @IsNotEmpty()
  phone: string;
}
