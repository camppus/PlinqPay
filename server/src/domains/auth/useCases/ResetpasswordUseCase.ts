import Encript from '@/lib/shared/Encript';
import { AuthRepositorie } from '../repo/@type';
import ResetPasswordDto from '../dto/reset.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import Password from '@/objectValues/Password';

export default class ResetPasswordUsecase {
  private readonly encript = new Encript();

  constructor(private readonly repo: AuthRepositorie) {}

  public async execute(data: ResetPasswordDto, id: string) {
    const tenant = await this.repo.getTenant(id);
    if (!tenant) {
      throw new NotFoundException({
        mesage: 'Empresa não encontrada no sistema',
      });
    }
    this.isCorrectPass(data.newPassword, data.confirmNewPasword);
    const password = new Password(data.newPassword);
    const isPassMatch = this.encript.compare(tenant.password, data.oldPassword);
    if (!isPassMatch) {
      throw new BadRequestException({
        message: 'Senha errada , tente com dados diferente',
      });
    }
    await this.repo.reset(password.getValue(), tenant.id);
    return {
      updadated: true,
    };
  }

  private isCorrectPass(newPassword: string, confirmNewPasword: string) {
    if (newPassword != confirmNewPasword) {
      throw new BadRequestException({
        message: 'A senha nova de ser igual a senha de confirmação',
      });
    }
  }
}