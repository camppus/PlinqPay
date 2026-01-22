import { ITransactionRepositorie } from '../repositories/@types';
import { CreateTransactionDTO } from '../dto/create.dto';
import { Paymentprocessor } from '@/infra/Getaway';
import { Price, PriceValidator } from '@/objectValues/Price';
import { TaxtCalculatorFactorie } from '@/objectValues/Tax/taxcalulator';
import { ApiSecretKeys } from '@prisma/client';

export class CreatePaymentUseCase {
  constructor(
    private readonly repo: ITransactionRepositorie,
    private readonly processor: Paymentprocessor,
  ) {}

  public async pay(data: CreateTransactionDTO, apikey: ApiSecretKeys) {
    data.method = this.processor.getMethod();
    const prices: Price[] = data.items.map((item) => {
      return new Price(item.price, item.quantity);
    });

    new PriceValidator(prices, data.amount);
    const taxtCalculator = new TaxtCalculatorFactorie('PERCENT');
    const precification = taxtCalculator.calc(data.amount);
    const getwayResponse = await this.processor.pay(
      precification.amount.toString(),
    );

    const createdPayment = await this.repo.createTransaction({
      asignature: getwayResponse.asignature,
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
    return {
      getWayInfo: getwayResponse,
      data: createdPayment,
    };
  }
}
