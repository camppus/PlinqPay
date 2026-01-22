import { ITransactionRepositorie } from '../repositories/@types';
import { CreateTransactionDTO } from '../dto/create.dto';
import { Paymentprocessor } from '@/infra/Getaway';
import { Price, PriceValidator } from '@/objectValues/Price';
import { TaxtCalculatorFactorie } from '@/objectValues/Tax/taxcalulator';
import Assignature from '@/lib/shared/Assignature';
import { ApiSecretKeys } from '@prisma/client';

export class CreatePaymentUseCase {
  private readonly assinature = new Assignature();
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
    const asignature = this.assinature.assignature(
      apikey.secretKey,
      JSON.stringify({
        externalId: data.externalId,
        amount: data.amount,
        method: data.method,
        callbackUrl: data.callbackUrl,
      }),
    );
    const getwayResponse = await this.processor.pay(
      precification.amount.toString(),
      asignature,
    );
    const createdPayment = await this.repo.createTransaction({
      asignature,
      companieId: apikey.companieId,
      getawayInfo: getwayResponse,
      precification,
      transaction: data,
    });
    return {
      getWayInfo: getwayResponse,
      data: createdPayment,
    };
  }
}
