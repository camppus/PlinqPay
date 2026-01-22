import { Transaction, WebHooks } from '@prisma/client';
import PrismaRepositorie from '@/infra/database/Prisma';
import { ExecuteWebHook } from '@/lib/shared/Webhooks';
import { CallBackHandler } from '../../sub/callback.sub';
import { ITransactionState } from '../state.interface';
import { BadGatewayException } from '@nestjs/common';

export class Fail implements ITransactionState {
  private readonly repo = PrismaRepositorie.getInstance();

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
  }

  private async handleWebHooks(data: Transaction): Promise<void> {
    const [failWebhook, hasFailNotification] = await Promise.all([
      this.repo.webHooks.findFirst({
        where: {
          companieId: data.companieId,
          scope: 'PAYMENTS',
          events: {
            hasSome: 'ERROR',
          },
        },
      }),
      this.repo.webhookDelivery.findFirst({
        where: {
          transactionId: data.id,
          event: 'ERROR',
        },
      }),
    ]);

    if (hasFailNotification || !failWebhook) {
      return;
    }

    const handler = new ExecuteWebHook();
    await handler.execute(failWebhook);

    await this.createDeliveryWebhok(data, failWebhook);
  }

  private async updateStatus(data: Transaction): Promise<void> {
    await this.repo.transaction.update({
      where: { id: data.id },
      data: { status: 'FAILED' },
    });
  }

  private async createDeliveryWebhok(
    data: Transaction,
    webHook: WebHooks,
  ): Promise<void> {
    await this.repo.webhookDelivery.create({
      data: {
        event: 'ERROR',
        payload: JSON.stringify(data),
        url: webHook.url,
        transactionId: data.id,
      },
    });
  }
}
