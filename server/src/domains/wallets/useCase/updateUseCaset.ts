
import { IWalletRepositorie } from '../repositories/@type';
import { Wallet } from '@prisma/client';
import { CreateWalletDTO } from '../dto/create.dto';
import { ConflictException } from '@nestjs/common';

export class UpdateWalletUseCase {
  constructor(private readonly repo: IWalletRepositorie) {}

  public async execute(
    data: CreateWalletDTO,
    tenantId: string,
  ): Promise<Wallet> {
    const hasWalet = await this.repo.getByUnique(tenantId);

    if (!hasWalet) {
      throw new ConflictException({
        message: 'E empresa precisa criar a acarteira',
      });
    }
    return this.repo.update(data, tenantId);
  }
}

export class ToggleWalletUseCase {
  constructor(private readonly repo: IWalletRepositorie) {}

  public async execute(walletId: string): Promise<{ updated: boolean }> {
    const hasWalet = await this.repo.getByUnique(walletId);

    if (!hasWalet) {
      throw new ConflictException({
        message: 'Carteira não encontrada',
      });
    }
    return this.repo.toogle(walletId);
  }
}
