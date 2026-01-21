import { Injectable } from '@nestjs/common';
import PrismaAUthRepositorie from './repo/repos/PrismaAuthRepositorie';
import LoginDto from './dto/login.dto';
import LoginUseCase from './useCases/LoginUseCase';

@Injectable()
export default class AuthService {
  constructor(private readonly repo: PrismaAUthRepositorie) {}

  public async login(data: LoginDto) {
    const loginUsecase = new LoginUseCase(this.repo);
    return await loginUsecase.execute(data);
  }
  
}
