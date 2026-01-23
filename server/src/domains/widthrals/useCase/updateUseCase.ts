import { BadRequestException } from '@nestjs/common';
import { ITenatsRepositories } from '@/domains/tenants/repositories/@type';
import { IWalletRepositorie } from '@/domains/wallets/repositories/@type';
import { IWidthdrawsRepositories } from '../repositories/@types';
import { UpdateWidthdralDto } from '../dto/update.dto';
import { IWidthDrawsStatusTransaction } from '../states';
import { Approved } from '../states/Approved';
import { Rejected } from '../states/Rejected';

export class UpdateWidthDrawUseCase {
  private readonly updaterStrategieMap: Record<
    'APPROVED' | 'REJECTED',
    IWidthDrawsStatusTransaction
  > = {
    APPROVED: new Approved(),
    REJECTED: new Rejected(),
  };
  constructor(
    private readonly tenantRepo: ITenatsRepositories,
    private readonly walletRepo: IWalletRepositorie,
    private readonly widthrawlRepo: IWidthdrawsRepositories,
  ) {}

  public async exute(data: UpdateWidthdralDto) {
    const [withdrawl] = await Promise.all([
      this.widthrawlRepo.getById(data.id),
    ]);

    if (!withdrawl) {
      throw new BadRequestException({
        messge: 'Saque não encontrado',
      });
    }

    const [wallet, tenant] = await Promise.all([
      this.walletRepo.getByUnique(withdrawl.companieId),
      this.tenantRepo.getByUnique(withdrawl.companieId),
    ]);

    if (!tenant) {
      throw new BadRequestException({
        messge: 'Empresa não encontrada',
      });
    }

    if (!wallet || !wallet.isVerified) {
      throw new BadRequestException({
        message: 'Precisas ter uma carteira activa',
      });
    }

    const strategie = this.updaterStrategieMap[data.status];
    await strategie.exeute(withdrawl, data);
    return {
      updated: true,
    };
  }
}
