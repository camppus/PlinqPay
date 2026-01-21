import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import AuthService from './auth.service';
import LoginDto from './dto/login.dto';

@Controller('v1/auth')
@ApiTags('Autenticação')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Login',
  })
  public async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
}
