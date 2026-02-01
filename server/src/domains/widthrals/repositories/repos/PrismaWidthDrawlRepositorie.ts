import PrismaRepositorie from '@/infra/database/Prisma';
import { IWidthdrawsRepositories } from '../@types';
import { Wallet, Withdrawals } from '@prisma/client';
import { CreateWidthrawlDto } from '../../dto/create.dto';
import { IPAginationGet } from '@/types';

export class PrismaWidthDrawlRepo implements IWidthdrawsRepositories {
  private readonly prisma = PrismaRepositorie.getInstance();

  public async create(
    data: CreateWidthrawlDto,
    tenantId: string,
    wallet: Wallet,
  ): Promise<Withdrawals> {
    return (await this.prisma.withdrawals.create({
      data: {
        companieId: tenantId,
        amount: Number(data.amount),
        walletId: wallet.id,
      },
    })) as Withdrawals;
  }

  public async getAll(
    page: number,
    limit: number,
  ): Promise<IPAginationGet<Withdrawals[]>> {
    const offset = (page - 1) * limit;

    const [data, total, totalWithdrawnAgg, totalPendingAgg, totalRejectedAgg] =
      await Promise.all([
        this.prisma.withdrawals.findMany({
          include: {
            companie: {
              select: {
                title: true,
                id: true,
                totalDisponible: true,
                totalErned: true,
                phone: true,
                email: true,
              },
            },
            wallet: true,
          },
          orderBy: [{ createdAt: 'desc' }],
          take: limit,
          skip: offset,
        }),
        this.prisma.withdrawals.count({}),
        this.prisma.withdrawals.aggregate({
          _sum: { amount: true },
          where: { status: { in: ['PAID', 'APPROVED'] } },
        }),
        this.prisma.withdrawals.aggregate({
          _sum: { amount: true },
          where: { status: 'PENDING' },
        }),
        this.prisma.withdrawals.aggregate({
          _sum: { amount: true },
          where: { status: 'REJECTED' },
        }),
      ]);

    const totalPages = Math.ceil(total / limit);

    const stats = [
      {
        title: 'Total Sacado',
        subtitle: 'O que já foi retirado',
        description: 'Soma de todos os saques aprovados ou pagos',
        amount: Number(totalWithdrawnAgg._sum.amount ?? 0),
        isCoin: true,
      },
      {
        title: 'Pendentes',
        subtitle: 'Saques aguardando aprovação',
        description: 'Soma de todos os saques ainda pendentes',
        amount: Number(totalPendingAgg._sum.amount ?? 0),
        isCoin: true,
      },
      {
        title: 'Recusados / Cancelados',
        subtitle: 'Perdas',
        description: 'Soma de todos os saques recusados ou cancelados',
        amount: Number(totalRejectedAgg._sum.amount ?? 0),
        isCoin: true,
      },
    ];

    return {
      data: data as any,
      pagination: {
        limit,
        page,
        lastPage: totalPages,
      },
      total: data.length,
      stats,
    };
  }

  public async getById(id: string): Promise<Withdrawals | null> {
    return await this.prisma.withdrawals.findFirst({
      where: {
        id,
      },
    });
  }

  public async getAllBytenant(
    page: number,
    limit: number,
    id: string,
  ): Promise<IPAginationGet<Withdrawals[]>> {
    const offset = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.withdrawals.findMany({
        take: limit,
        skip: offset,
        where: {
          companieId: id,
        },
      }),
      this.prisma.withdrawals.count({
        where: {
          companieId: id,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data: data as any,
      pagination: {
        limit,
        page,
        lastPage: totalPages,
      },
      total: data.length,
    };
  }
  public async getAllBytenantPendings(id: string): Promise<number> {
    const [total] = await Promise.all([
      this.prisma.withdrawals.count({
        where: {
          companieId: id,
          status: 'PENDING',
        },
      }),
    ]);
    return total;
  }
}
