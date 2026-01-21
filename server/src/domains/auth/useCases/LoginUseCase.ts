import { BadRequestException, NotFoundException } from '@nestjs/common';
import LoginDto from '../dto/login.dto';
import { AuthRepositorie } from '../repo/@type';
import Encript from '@/lib/shared/Encript';
import JWT from '@/lib/shared/Jwt';

export default class LoginUseCase {
  private readonly encript = new Encript();
  private readonly jwt = new JWT();
  constructor(private readonly repo: AuthRepositorie) {}
  public async execute(dto: LoginDto) {
    const tenant = await this.repo.getTenant(dto.email);
    if (!tenant) {
      throw new NotFoundException({
        message: 'Usuário não encontrado',
      });
    }
    const isPasswordCorret = this.encript.compare(
      tenant.password,
      dto.password,
    );
    if (!isPasswordCorret) {
      throw new BadRequestException({
        message: 'Senha Errada',
      });
    }
    const tokenData = this.jwt.sign(
      {
        role: tenant.role,
        sub: tenant.id,
      },
      {
        expiresIn: '14d',
      },
    );
    const { password, ...rest } = tenant;
    return {
      acessToken: tokenData,
      message: !rest?.isVerified
        ? 'Verifique a sua conta'
        : 'Bem vindo de volta',
      data: rest,
    };
  }
}
