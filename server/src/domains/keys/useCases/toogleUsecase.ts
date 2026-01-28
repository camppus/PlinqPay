import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ApiKeyRepositorie } from '../repositories/@types';

export default class ToogleApiKeyUseCase {
  constructor(private readonly repo: ApiKeyRepositorie) {}

  public async execute(id: string, userId : string) {
    const key = await this.repo.getById(id);

    if (!key) {
      throw new BadRequestException('Chave não encontrda');
    }

    if (key.companieId != userId) {
      throw new ForbiddenException(
        'Precisa ser dono da cheve para poder actualizar',
      );
    }
    const updated = await this.repo.toogle(id);
    return updated;
  }
}
