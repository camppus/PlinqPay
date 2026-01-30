import { Transaction } from '@prisma/client';
import PrismaRepositorie from '@/infra/database/Prisma';
import { CallBackHandler } from '../../sub/callback.sub';
import { ITransactionState } from '../state.interface';
import { BadGatewayException } from '@nestjs/common';
import { NotificationsService } from '@/domains/notifications/notification.service';

export class Paid implements ITransactionState {
  private readonly repo = PrismaRepositorie.getInstance();

  constructor(private readonly notifier: NotificationsService) { }
  

  public async execute(data: Transaction) {
    if (data?.status != 'PENDING') {
      throw new BadGatewayException({
        message: 'Apenas pagamentos pedentes podem ser confirmados!',
      });
    }
    await this.handleWebHooks(data);
    await this.updateStatus(data);
    await this.updateTenantGains(data);
    const callbackhandler = new CallBackHandler();
    await callbackhandler.notfy({
      ...data,
      status: 'PAID',
    });

    await this.notifier.update(
      {
        companieId: data.companieId,
        entitieId: data.id,
        message: `Pagamento aprovado ${Number(data.amount).toLocaleString('pt')},00 kz`,
        type: 'PAYMENT',
      },
      data.id,
    );
  }
  private async handleWebHooks(data: Transaction): Promise<void> {
    const [hasPaidNotification] = await Promise.all([
      this.repo.webhookDelivery.findFirst({
        where: {
          transactionId: data.id,

          event: 'SUCCESS',
        },
      }),
    ]);
    if (hasPaidNotification) {
      return;
    }
    await this.createDeliveryWebhok(data);
  }
  private async updateStatus(data: Transaction): Promise<void> {
    await this.repo.transaction.update({
      data: {
        status: 'PAID',
      },
      where: {
        id: data.id,
      },
    });
  }
  private async updateTenantGains(data: Transaction): Promise<void> {
    await this.repo.tenants.update({
      where: {
        id: data.companieId,
      },
      data: {
        totalDisponible: {
          increment: data.subtotal,
        },
        totalErned: {
          increment: data.total,
        },
        totalErnedWithTax: {
          increment: data.subtotal,
        },
      },
    });
  }
  private async createDeliveryWebhok(data: Transaction): Promise<void> {
    const created = await this.repo.webhookDelivery.create({
      data: {
        event: 'SUCCESS',
        payload: JSON.stringify(data),
        url: data.callbackUrl,
        transactionId: data.id,
      },
    });
  }
}
