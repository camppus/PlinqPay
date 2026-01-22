import { IWebhookRepositorie } from '@/domains/webhooks/repositories/@type';
import { ExecuteWebHook } from '@/lib/shared/Webhooks';
import { PaymentStatus, Transaction } from '@prisma/client';
import { IObserverPayment } from '..';
import { CallBackHandler } from '../sub/callback.sub';

export class PubTransaction {
  private readonly webhookHandler = new ExecuteWebHook();

  private readonly mappedEvents: Record<PaymentStatus, IObserverPayment[]> = {
    APPROVED: [new CallBackHandler()],
    FAILED: [new CallBackHandler()],
    PAID: [new CallBackHandler()],
    PENDING: [new CallBackHandler()],
    REJECTED: [new CallBackHandler()],
  };

  constructor(private readonly webhookRepo: IWebhookRepositorie) {}

  public async execute(transaction: Transaction) {
    const observers = this.mappedEvents[transaction.status];

    await observers.map(async (obs) => {
      await obs.notfy(transaction);
    });
  }
}
