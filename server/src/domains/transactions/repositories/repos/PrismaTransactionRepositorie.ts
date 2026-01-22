import PrismaRepositorie from '@/infra/database/Prisma';
import {
  ICreateTranstionProps,
  ITransactionRepositorie,
  TransactionModel,
} from '../@types';
import {
  PaymentStatus,
  Transaction,
  TransactionClientInfo,
} from '@prisma/client';

import { TransactionCartItemDTO } from '../../dto/create.dto';
import { IPAginationGet } from '@/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTransactionRepositorie implements ITransactionRepositorie {
  private readonly prisma = PrismaRepositorie.getInstance();

  public async createTransaction(
    data: ICreateTranstionProps,
  ): Promise<Transaction> {
    const { asignature, companieId, precification, transaction, getawayInfo } =
      data;
    const createdTransaction = await this.prisma.transaction.create({
      data: {
        amount: precification.amount,
        total: precification.total,
        callbackUrl: transaction.callbackUrl,
        signature: asignature,
        subtotal: precification.subtotal,
        method: 'REFERENCE',
        tax: precification.tax,
        taxType: precification.taxtType,
        companieId: companieId,
        currency: 'kz',
        entity: getawayInfo.entitie,
        reference: getawayInfo.reference,
        paymentUrl: getawayInfo.payUrl,
        qrCodeUrl: getawayInfo.payUrl,
        status: 'PENDING',
        externId: transaction.externalId,
        getawayIdentifier: getawayInfo.id,
        client: {
          create: {
            ...transaction.client,
          },
        },
      },
    });
    await this.createCardItems(transaction.items, createdTransaction.id);
    return createdTransaction;
  }

  public async createCardItems(
    items: TransactionCartItemDTO[],
    transactionId: string,
  ): Promise<{ count: number }> {
    const mappedTransactionItems = items.map((item) => {
      return {
        createdAt: new Date(),
        price: item.price,
        quantity: item.quantity,
        title: item.title,
        transactionId: transactionId,
      };
    });
    const createdItems = await this.prisma.transactionItem.createMany({
      data: mappedTransactionItems,
    });
    return {
      count: createdItems.count,
    };
  }

  public async getAll(
    page: number,
    limit: number,
  ): Promise<IPAginationGet<Transaction>> {
    const offset = (page - 1) * limit;
    const payments = await this.prisma.transaction.findMany({
      take: limit,
      skip: offset,
      include: {
        client: true,
        items: true,
      },
    });
    return {
      data: payments,
      pagination: {
        cursor: page,
        limit,
      },
      total: payments.length,
    };
  }

  public async getAllByTenant(
    page: number,
    limit: number,
    tenantId: string,
  ): Promise<IPAginationGet<Transaction>> {
    const offset = (page - 1) * limit;
    const payments = await this.prisma.transaction.findMany({
      take: limit,
      skip: offset,
      include: {
        client: true,
        items: true,
      },
      where: {
        companieId: tenantId,
      },
    });
    return {
      data: payments,
      pagination: {
        cursor: page,
        limit,
      },
      total: payments.length,
    };
  }

  public async getDetails(unique: string): Promise<TransactionModel | null> {
    return await this.prisma.transaction.findFirst({
      where: {
        OR: [
          {
            id: unique,
          },
          {
            getawayIdentifier: unique,
          },
          {
            signature: unique,
          },
        ],
      },
      include: {
        client: true,
        webhooksDelivery: true,
        items: true,
      },
    });
  }

  public async update(id: string, status: PaymentStatus): Promise<Transaction> {
    return await this.prisma.transaction.update({
      data: {
        status,
      },
      where: {
        id,
      },
    });
  }
}
