import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateWidthrawlDto } from '../dto/create.dto';
import { ITenatsRepositories } from '@/domains/tenants/repositories/@type';
import { IWalletRepositorie } from '@/domains/wallets/repositories/@type';
import { IWidthdrawsRepositories } from '../repositories/@types';
import { NotificationsService } from '@/domains/notifications/notification.service';

export class CreateWidthDrawUseCase {
  constructor(
    private readonly tenantRepo: ITenatsRepositories,
    private readonly walletRepo: IWalletRepositorie,
    private readonly widthrawlRepo: IWidthdrawsRepositories,
    private readonly notifier: NotificationsService,
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

    const widhtraw = await this.widthrawlRepo.create(data, tenantId, wallet);
    await this.notifier.create({
      companieId: tenantId,
      entitieId: widhtraw.id,
      message: `Saque criado ${Number(data.amount).toLocaleString('pt')},00 kz`,
      type: 'WITHDRAWALS',
    });
    return {
      data: widhtraw,
      message: 'Criado com sucesso',
    };
  }
}
