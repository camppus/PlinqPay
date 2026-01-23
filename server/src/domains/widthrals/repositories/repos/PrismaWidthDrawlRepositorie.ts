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
    const data = await this.prisma.wallet.findMany({
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
      },
      take: limit,
      skip: offset,
    });

    return {
      data: data as any,
      pagination: {
        limit,
        cursor: page,
      },
      total: data.length,
    };
  }

  public async getById(id: string): Promise<Withdrawals | null> {
    return await this.prisma.withdrawals.findFirst({
      where: {
        id,
      },
    });
  }
}
