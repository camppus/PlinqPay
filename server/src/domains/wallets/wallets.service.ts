
import { PrismaWalletRepositorie } from './repositories/repos/PrismaWalletRepositorie';
import { CreateWalletUseCase } from './useCase/createUseCase';
import { GetWalletByUniqueUseCase , GetAllWalletsUseCase } from './useCase/getUseCases';
import { UpdateWalletUseCase ,ToggleWalletUseCase} from './useCase/updateUseCaset';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletService {
  private createWallet: CreateWalletUseCase;
  private getWalletByUnique: GetWalletByUniqueUseCase;
  private getAllWallets: GetAllWalletsUseCase;
  private updateWallet: UpdateWalletUseCase;
  private toggleWallet: ToggleWalletUseCase;

  constructor(private readonly repo: PrismaWalletRepositorie) {
    this.createWallet = new CreateWalletUseCase(repo);
    this.getWalletByUnique = new GetWalletByUniqueUseCase(repo);
    this.getAllWallets = new GetAllWalletsUseCase(repo);
    this.updateWallet = new UpdateWalletUseCase(repo);
    this.toggleWallet = new ToggleWalletUseCase(repo);
  }

  async create(data: any, tenantId: string) {
    return this.createWallet.execute(data, tenantId);
  }

  async getByUnique(unique: string) {
    return this.getWalletByUnique.execute(unique);
  }

  async getAll(page: number, limit: number) {
    return this.getAllWallets.execute(page, limit);
  }

  async update(data: any, tenantId: string) {
    return this.updateWallet.execute(data, tenantId);
  }

  async toggle(walletId: string) {
    return this.toggleWallet.execute(walletId);
  }
}
