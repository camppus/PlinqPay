import { PaymentMethod } from '@prisma/client';
import ReferencePayment from './useCases/createReferencePayment';

export interface IGetawayReponse {
  reference: string;
  entitie: string;
  payUrl: string;
  id: string;
}

export interface PaymentStrategie {
  pay(amount: string, asignature: string): Promise<IGetawayReponse>;
}

export class Paymentprocessor implements PaymentStrategie {
  private readonly paymentStrategieMap: Record<
    PaymentMethod,
    PaymentStrategie
  > = {
    REFERENCE: new ReferencePayment(),
  };
  constructor(private readonly method: PaymentMethod) {}

  public async pay(
    amount: string,
    asignature: string,
  ): Promise<IGetawayReponse> {
    const strategie = this.paymentStrategieMap[this.method];
    const data = await strategie.pay(amount, asignature);
    return data;
  }
  public getMethod(): PaymentMethod {
    return this.method;
  }
}
