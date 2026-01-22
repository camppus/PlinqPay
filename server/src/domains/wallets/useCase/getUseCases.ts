
import { IWalletRepositorie } from '../repositories/@type';
import { Wallet } from '@prisma/client';

export class GetWalletByUniqueUseCase {
  constructor(private readonly repo: IWalletRepositorie) {}

  public async execute(unique: string): Promise<Wallet | null> {
    return this.repo.getByUnique(unique);
  }
}
import { IPAginationGet } from '@/types';

export class GetAllWalletsUseCase {
  constructor(private readonly repo: IWalletRepositorie) {}

  public async execute(page: number, limit: number): Promise<IPAginationGet<Wallet[]>> {
    return this.repo.getAll(page, limit);
  }
}
