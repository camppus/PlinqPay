import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateWidthrawlDto } from '../dto/create.dto';
import { ITenatsRepositories } from '@/domains/tenants/repositories/@type';
import { IWalletRepositorie } from '@/domains/wallets/repositories/@type';
import { IWidthdrawsRepositories } from '../repositories/@types';
import { NotificationsService } from '@/domains/notifications/notification.service';
import { Withdrawals } from '@prisma/client';

export class CreateWidthDrawUseCase {
  constructor(
    private readonly tenantRepo: ITenatsRepositories,
    private readonly walletRepo: IWalletRepositorie,
    private readonly widthrawlRepo: IWidthdrawsRepositories,
    private readonly notifier: NotificationsService,
  ) {}

  public async exute(data: CreateWidthrawlDto, tenantId: string) {
    const [tenant, wallet, WITHDRAWALS] = await Promise.all([
      this.tenantRepo.getByUnique(tenantId),
      this.walletRepo.getByUnique(tenantId),
      this.widthrawlRepo.getAllBytenant(1, 100, tenantId),
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

    const saldo = Number(tenant.data.totalDisponible);
    if (saldo < data.amount) {
      throw new BadRequestException({
        message: 'Saldo insuficiente',
      });
    }
    const dataWitdhdraws = WITHDRAWALS.data as any as Withdrawals[];
    const hasPending = dataWitdhdraws.filter((i) => {
      return i.status == 'PENDING';
    }).length;

    if (hasPending > 0) {
      throw new BadRequestException({
        message: 'Precisas esperar o último pedido',
      });
    }
    const widhtraw = await this.widthrawlRepo.create(data, tenantId, wallet);
    await this.notifier.create({
      companieId: tenantId,
      entitieId: widhtraw.id,
      message: `Saque pendente ${Number(data.amount).toLocaleString('pt')},00 kz`,
      type: 'WITHDRAWALS',
    });
    return {
      data: widhtraw,
      message: 'Criado com sucesso',
    };
  }
}
