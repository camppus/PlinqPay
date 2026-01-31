import { ITransactionRepositorie } from '../repositories/@types';
import { CreateTransactionDTO } from '../dto/create.dto';
import { Paymentprocessor } from '@/infra/Getaway';
import { Price, PriceValidator } from '@/objectValues/Price';
import { TaxCalculatorFactory } from '@/objectValues/Tax/taxcalulator';
import { ApiSecretKeys } from '@prisma/client';
import { NotificationsService } from '@/domains/notifications/notification.service';
import Assignature from '@/lib/shared/Assignature';

export class CreatePaymentUseCase {
  constructor(
    private readonly repo: ITransactionRepositorie,
    private readonly processor: Paymentprocessor,
    private readonly notifier: NotificationsService,
  ) {}

  public async pay(data: CreateTransactionDTO, apikey: ApiSecretKeys) {
    data.method = this.processor.getMethod();
    const prices: Price[] = data.items.map((item) => {
      return new Price(item.price, item.quantity);
    });

    new PriceValidator(prices, data.amount);
    const taxtCalculator = new TaxCalculatorFactory('PERCENT');
    const precification = taxtCalculator.calc(data.amount);
    const getwayResponse = await this.processor.pay(
      precification.amount.toString(),
    );

    const signature = new Assignature().assignature(apikey.secretKey, data);

    const createdPayment = await this.repo.createTransaction({
      asignature: signature,
      companieId: apikey.companieId,
      getawayInfo: getwayResponse,
      precification: {
        amount: precification.amount,
        tax: precification.tax,
        subtotal: precification.amount - precification.tax,
        total: precification.amount,
        taxtType: precification.taxtType,
      },
      transaction: data,
    });

    await this.notifier.create({
      companieId: apikey.companieId,
      entitieId: createdPayment.id,
      message: 'Pagamento pendente',
      type: 'PAYMENT',
    });
    return {
      data: createdPayment,
    };
  }
}
