import { NotFoundException } from '@nestjs/common';
import { ITenatsRepositories } from '../repositories/@type';

export class DeleteTenanteUseCase {
  constructor(private readonly repo: ITenatsRepositories) {}
  public async execute(unique: string) {
    const tenant = await this.repo.getByUnique(unique);

    if (!tenant) {
      throw new NotFoundException({
        message: 'Empresa não encontrada',
      });
    }
    return await this.repo.delete(unique);
  }
}
