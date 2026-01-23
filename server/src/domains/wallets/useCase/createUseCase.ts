import { IWalletRepositorie } from '../repositories/@type';
import { Wallet } from '@prisma/client';
import { CreateWalletDTO } from '../dto/create.dto';
import { ConflictException } from '@nestjs/common';

export class CreateWalletUseCase {
  constructor(private readonly repo: IWalletRepositorie) {}

  public async execute(
    data: CreateWalletDTO,
    tenantId: string,
  ): Promise<Wallet> {
    const hasWalet = await this.repo.getByUnique(tenantId);

    if (hasWalet) {
      throw new ConflictException({
        message: 'Empresa já possui a carteira PlinqPay',
      });
    }
    return this.repo.create(data, tenantId);
  }
}
