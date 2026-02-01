import { Logger } from '@nestjs/common';
import { IObserverPayment } from '..';
import { Transaction } from '@prisma/client';

export class CallBackHandler implements IObserverPayment {
  private readonly logger = new Logger(CallBackHandler.name);
  public async notfy(data: Transaction): Promise<void> {
    try {
      await fetch(`${data.callbackUrl}`, {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data }),
      });
    } catch (error) {
      this.logger.fatal(error);
    }
  }
}
