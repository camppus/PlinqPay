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
    const [
      payments,
      total,
      totalPayments,
      totalWithdraws,
      totalPendings,
      widhraws,
      canceled,
    ] = await Promise.all([
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
      this.prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: 'PENDING',
        },
      }),
      this.prisma.withdrawals.findMany({
        take: 50,
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      }),
      this.prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: 'FAILED',
        },
      }),
    ]);
    const totalPages = Math.ceil(total / limit);
    const totalIn = Number(totalPayments._sum.amount ?? 0);
    const totalMade = Number(totalPayments._sum.subtotal ?? 0);
    const totalOut = Number(totalWithdraws._sum.amount ?? 0);
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
        title: 'Pendências',
        subtitle: 'Pagamentos a confirmar',
        description: 'Valor de pagamentos ainda pendentes',
        amount: Number(totalPendings._sum.amount ?? 0),
        isCoin: true,
      },
      {
        title: 'Comissões / Ganhos',
        subtitle: 'O que ganhamos',
        description:
          'Diferença entre o total recebido e o valor líquido dos clientes',
        amount: totalIn - totalMade,
        isCoin: true,
      },
      {
        title: 'Saldo Disponível',
        subtitle: 'O que sobra',
        description: 'Entradas menos saques',
        amount: totalIn - totalOut,
        isCoin: true,
      },
      {
        title: 'Cancelados',
        subtitle: 'Perdas',
        description: 'Valor de pagamentos que foram cancelados',
        amount: Number(canceled._sum.amount),
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
