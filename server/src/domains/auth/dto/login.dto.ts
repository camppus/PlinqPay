import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Email',
    example: 'pedro@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Senha',
    example: '*******',
  })
  password: string;
}
