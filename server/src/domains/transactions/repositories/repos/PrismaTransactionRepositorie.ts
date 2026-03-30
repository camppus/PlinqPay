import PrismaRepositorie from '@/infra/database/Prisma';
import {
  ICreateTranstionProps,
  ITransactionRepositorie,
  TransactionModel,
} from '../@types';
import { PaymentStatus, Transaction } from '@prisma/client';

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
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const [
      monthly,
      payments,
      total,
      totalPayments,
      totalWithdraws,
      widhraws
    ] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
           status: {
            in: ['APPROVED', 'PAID'],
          },
          createdAt: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
        select: {
          subtotal: true,
          total: true,
        },
      }),
      this.prisma.transaction.findMany({
        take: limit,
        skip: offset,
        include: {
          client: true,
          items: true,
          companie: {
            select: {
              title: true,
              id: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      }),
      this.prisma.transaction.count(),
      this.prisma.transaction.aggregate({
        _sum: {
          amount: true,
          subtotal: true,
        },
        where: {
          status: 'PAID',
        },
      }),
      this.prisma.withdrawals.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: {
            in: ['APPROVED', 'PAID'],
          },
        },
      }),
      this.prisma.withdrawals.findMany({
        take: 50,
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      })
    ]);
    const totalPages = Math.ceil(total / limit);
    const totalIn = Number(totalPayments._sum.amount ?? 0);
    const totalMade = Number(totalPayments._sum.subtotal ?? 0);
    const totalFee = transactions.reduce((acc, tx) => {
      return acc + (Number(tx.total) - Number(tx.subtotal));
    }, 0);
    const stats = [
      {
        title: 'Faturamento Total',
        subtitle: 'Tudo que entrou',
        description: 'Total de pagamentos confirmados (incluindo comissão)',
        amount: totalMade,
        isCoin: true,
      },
      {
        title: 'Recebido',
        subtitle: 'Entradas líquidas',
        description: 'Valor realmente recebido dos pagamentos',
        amount: totalIn,
        isCoin: true,
      },
      {
        title: 'Comissões Mensal',
        subtitle: 'O que ganhamos',
        description:
          'Valor ganho neste mês',
        amount: totalFee,
        isCoin: true,
      },
    ];

    return {
      data: payments,
      pagination: {
        page,
        limit,
        lastPage: totalPages,
      },
      total,
      stats: {
        stats,
        widhraws,
      },
    };
  }

  public async getAllByTenant(
    page: number,
    limit: number,
    tenantId: string,
  ): Promise<IPAginationGet<Transaction>> {
    const offset = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.prisma.transaction.findMany({
        take: limit,
        skip: offset,
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        include: {
          client: true,
          items: true,
        },
        where: {
          companieId: tenantId,
        },
      }),
      this.prisma.transaction.count({
        where: {
          companieId: tenantId,
        },
      }),
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      data: payments,
      pagination: {
        page,
        limit,
        lastPage: totalPages,
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
          {
            externId: unique,
          },
        ],
      },
      include: {
        client: true,
        webhooksDelivery: true,
        items: true,
        companie: true,
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
