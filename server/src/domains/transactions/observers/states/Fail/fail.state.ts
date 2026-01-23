import { Transaction } from '@prisma/client';
import PrismaRepositorie from '@/infra/database/Prisma';
import { CallBackHandler } from '../../sub/callback.sub';
import { ITransactionState } from '../state.interface';
import { BadGatewayException } from '@nestjs/common';
import { NotificationsService } from '@/domains/notifications/notification.service';

export class Fail implements ITransactionState {
  private readonly repo = PrismaRepositorie.getInstance();

  constructor(private readonly notification: NotificationsService) {}
  public async execute(data: Transaction) {
    if (data?.status !== 'PENDING') {
      throw new BadGatewayException({
        message: 'Apenas pagamentos PENDING podem falhar',
      });
    }

    await this.updateStatus(data);
    await this.handleWebHooks(data);

    const callbackhandler = new CallBackHandler();
    await callbackhandler.notfy({
      ...data,
      status: 'FAILED',
    });

    await this.notification.update(
      {
        companieId: data.companieId,
        entitieId: data.id,
        message: `Pagamento cancelado ${Number(data.amount).toLocaleString('pt')},00 kz`,
        type: 'PAYMENT',
      },
      data.id,
    );
  }

  private async handleWebHooks(data: Transaction): Promise<void> {
    const [hasFailNotification] = await Promise.all([
      this.repo.webhookDelivery.findFirst({
        where: {
          transactionId: data.id,
          event: 'ERROR',
        },
      }),
    ]);

    if (hasFailNotification) {
      return;
    }

    await this.createDeliveryWebhok(data);
  }

  private async updateStatus(data: Transaction): Promise<void> {
    await this.repo.transaction.update({
      where: { id: data.id },
      data: { status: 'FAILED' },
    });
  }

  private async createDeliveryWebhok(data: Transaction): Promise<void> {
    await this.repo.webhookDelivery.create({
      data: {
        event: 'ERROR',
        payload: JSON.stringify(data),
        url: data.callbackUrl,
        transactionId: data.id,
      },
    });
  }
}
