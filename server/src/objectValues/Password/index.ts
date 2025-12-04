import { BadRequestException } from '@nestjs/common';
import Encript from '@/lib/shared/Encript';

export default class Password {
  private readonly encript = new Encript();
  constructor(private readonly password: string) {
    this.validate(this.password);
  }

  private validate(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Senha precisa de pelo menos 8 caráctere');
    }
  }
  public getValue(): string {
    return this.encript.encript(this.password);
  }
}
