import { Body, Controller, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import AuthService from './auth.service';
import LoginDto from './dto/login.dto';
import ResetPasswordDto from './dto/reset.dto';
import { CurrentUser } from '@/decorators/currentUser.decorator';

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

  @Put('/reset')
  @ApiOperation({
    summary: 'Reset password',
  })
  public async reset(
    @Body() dto: ResetPasswordDto,
    @CurrentUser(ParseUUIDPipe) id: string,
  ) {
    return await this.authService.reset(dto, id);
  }
}
