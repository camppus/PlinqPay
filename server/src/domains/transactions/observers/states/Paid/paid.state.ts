import { Transaction, WebHooks } from '@prisma/client';
import PrismaRepositorie from '@/infra/database/Prisma';
import { ExecuteWebHook } from '@/lib/shared/Webhooks';
import { CallBackHandler } from '../../sub/callback.sub';
import { ITransactionState } from '../state.interface';
import { BadGatewayException } from '@nestjs/common';

export class Paid implements ITransactionState {
  private readonly repo = PrismaRepositorie.getInstance();
  public async execute(data: Transaction) {

    if (data?.status != "PENDING") {
      throw new BadGatewayException({
        message : "Apenas pagamen"
      })
    }
    await this.handleWebHooks(data);
    await this.updateStatus(data);
    await this.updateTenantGains(data);
    const callbackhandler = new CallBackHandler();
    await callbackhandler.notfy({
      ...data,
      status: 'PAID',
    });
  }
  private async handleWebHooks(data: Transaction): Promise<void> {
    const [paidWebhooks, hasPaidNotification] = await Promise.all([
      this.repo.webHooks.findFirst({
        where: {
          companieId: data.companieId,
          scope: 'PAYMENTS',
          events: {
            hasSome: 'SUCCESS',
          },
        },
      }),
      this.repo.webhookDelivery.findFirst({
        where: {
          transactionId: data.id,

          event: 'SUCCESS',
        },
      }),
    ]);
    if (hasPaidNotification || !paidWebhooks) {
      return;
    }
    const handler = new ExecuteWebHook();
    await handler.execute(paidWebhooks);
    await this.createDeliveryWebhok(data, paidWebhooks);
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
          increment: data.total,
        },
        totalErned: {
          increment: data.subtotal,
        },
        totalErnedWithTax: {
          increment: data.subtotal,
        },
      },
    });
  }
  private async createDeliveryWebhok(
    data: Transaction,
    webHook: WebHooks,
  ): Promise<void> {
    const created = await this.repo.webhookDelivery.create({
      data: {
        event: 'SUCCESS',
        payload: JSON.stringify(data),
        url: webHook.url,
        transactionId: data.id,
      },
    });
  }
}
