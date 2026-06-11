import { Injectable } from '@nestjs/common';
import PrismaAUthRepositorie from './repo/repos/PrismaAuthRepositorie';
import LoginDto from './dto/login.dto';
import LoginUseCase from './useCases/LoginUseCase';
import ResetPasswordDto from './dto/reset.dto';
import ResetPasswordUsecase from './useCases/ResetpasswordUseCase';

@Injectable()
export default class AuthService {
  constructor(private readonly repo: PrismaAUthRepositorie) {}

  public async login(data: LoginDto) {
    const loginUsecase = new LoginUseCase(this.repo);
    return { message : "internal"}
    return await loginUsecase.execute(data);
  }
  public async reset(data: ResetPasswordDto, id: string) {
    const reseter = new ResetPasswordUsecase(this.repo);
    return await reseter.execute(data, id);
  }
}
