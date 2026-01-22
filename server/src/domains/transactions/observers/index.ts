import { PaymentStatus, Transaction } from '@prisma/client';
import { ICreateTranstionProps } from '../repositories/@types';

export interface IObserverPayment {
  notfy(data: Transaction): Promise<void>;
}

export class PaymentObserver {
  constructor(private readonly observers: IObserverPayment[]) {}

  public addObserver(newSub: IObserverPayment) {
    this.observers.push(newSub);
  }

  public execute(paymentdata: Transaction) {
    this.observers.forEach(async (observer) => {
      await observer.notfy(paymentdata);
    });
  }
}
