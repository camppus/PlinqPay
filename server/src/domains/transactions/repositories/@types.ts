import {
  PaymentStatus,
  Prisma,
  Tenants,
  Transaction,
  TransactionClientInfo,
  TransactionItem,
} from '@prisma/client';
import {
  CreateTransactionDTO,
  TransactionCartItemDTO,
} from '../dto/create.dto';
import { IPAginationGet, ITaxCalculator } from '@/types';
import { IGetawayReponse } from '@/infra/Getaway';

export type TransactionModel = Prisma.TransactionGetPayload<{
  include: {
    client: {
      select: {
        email: true;
        name: true;
        phone: true;
      };
    };
    webhooksDelivery: true;
    items: {
      select: {
        price: true;
        quantity: true;
        title: true;
      };
    };
  };
}>;

export interface ICreateTranstionProps {
  companieId: string;
  precification: ITaxCalculator;
  asignature: string;
  transaction: CreateTransactionDTO;
  getawayInfo: IGetawayReponse;
}

export interface ITransactionRepositorie {
  createTransaction(data: ICreateTranstionProps): Promise<Transaction>;
  createCardItems(
    items: TransactionCartItemDTO[],
    transactionId: string,
  ): Promise<{ count: number }>;

  getDetails(unique: string): Promise<TransactionModel | null>;
  getAll(page: number, limit: number): Promise<IPAginationGet<Transaction>>;
  getAllByTenant(
    page: number,
    limit: number,
    tenantId: string,
  ): Promise<IPAginationGet<Transaction>>;
  update(id: string, status: PaymentStatus): Promise<Transaction>;
}
