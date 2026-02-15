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

  private readonly limitPerDay = 1;

  public async exute(data: CreateWidthrawlDto, tenantId: string) {
    const [tenant, wallet, WITHDRAWALS, hasRecent] = await Promise.all([
      this.tenantRepo.getByUnique(tenantId),
      this.walletRepo.getByUnique(tenantId),
      this.widthrawlRepo.getAllBytenantPendings(tenantId),
      this.widthrawlRepo.getRecents(tenantId),
    ]);

    if (hasRecent) {
      this.validateLimits(hasRecent);
    }
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
    console.log(data, tenant);

    if (WITHDRAWALS > 0) {
      throw new BadRequestException({
        message: 'Precisas esperar o último pedido',
      });
    }
    const amount = Number(data.amount);

    if (!amount || amount <= 0) {
      throw new BadRequestException({
        message: 'Valor inválido',
      });
    }

    if (saldo < amount) {
      throw new BadRequestException({
        message: 'Saldo insuficiente',
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
  private validateLimits(withdrawal: Withdrawals) {
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
    );

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    );

    const withdrawDate = new Date(withdrawal.createdAt);

    const isToday = withdrawDate >= startOfDay && withdrawDate <= endOfDay;

    if (isToday) {
      throw new ConflictException(
        `Já existe um saque hoje. Limite: ${this.limitPerDay} por dia`,
      );
    }
  }
}
