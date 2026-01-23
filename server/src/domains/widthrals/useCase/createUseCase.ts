import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateWidthrawlDto } from '../dto/create.dto';
import { ITenatsRepositories } from '@/domains/tenants/repositories/@type';
import { IWalletRepositorie } from '@/domains/wallets/repositories/@type';
import { IWidthdrawsRepositories } from '../repositories/@types';

export class CreateWidthDrawUseCase {
  constructor(
    private readonly tenantRepo: ITenatsRepositories,
    private readonly walletRepo: IWalletRepositorie,
    private readonly widthrawlRepo: IWidthdrawsRepositories,
  ) {}

  public async exute(data: CreateWidthrawlDto, tenantId: string) {
    const [tenant, wallet] = await Promise.all([
      this.tenantRepo.getByUnique(tenantId),
      this.walletRepo.getByUnique(tenantId),
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

    const saldo = Math.round(Number(tenant.data.totalDisponible) * 100);
    if (saldo < data.amount) {
      throw new BadRequestException({
        message: 'Saldo insuficiente',
      });
    }
    const pendwinWirdRwasl = wallet.withdrawals.filter((item) => {
      return item.status == 'PENDING';
    });

    if (pendwinWirdRwasl.length > 0) {
      throw new ConflictException({
        message: 'Precisas aguardar a útima pendência ser concluida',
      });
    }
    return await this.widthrawlRepo.create(data, tenantId, wallet);
  }
}
