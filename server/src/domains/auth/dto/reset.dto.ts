import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export default class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsStrongPassword()
  newPassword: string;
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty()
  confirmNewPasword: string;
}
