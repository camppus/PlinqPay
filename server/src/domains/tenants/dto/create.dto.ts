import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class CreateCompanieDTo {
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

  @ApiProperty({
    example: 'StrongPass@123',
    description: 'Senha da empresa',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
