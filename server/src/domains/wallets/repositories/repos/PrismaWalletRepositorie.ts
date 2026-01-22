import PrismaRepositorie from '@/infra/database/Prisma';
import { IWalletRepositorie } from '../@type';
import { Wallet } from '@prisma/client';
import { IPAginationGet } from '@/types';
import { CreateWalletDTO } from '../../dto/create.dto';

export class PrismaWalletRepositorie implements IWalletRepositorie {
  private readonly prisma = PrismaRepositorie.getInstance();

  public async create(
    data: CreateWalletDTO,
    tenantId: string,
  ): Promise<Wallet> {
    return await this.prisma.wallet.create({
      data: {
        ...data,
        companieId: tenantId,
        isVerified: true,
      },
    });
  }

  public async getAll(
    page: number,
    limit: number,
  ): Promise<IPAginationGet<Wallet[]>> {
    const offset = (page - 1) * limit;
    const wallets = await this.prisma.wallet.findMany({
      take: limit,
      skip: offset,
    });

    return {
      data: wallets as any,
      pagination: {
        cursor: page,
        limit,
      },
      total: wallets.length,
    };
  }

  public async getByUnique(unique: string): Promise<Wallet | null> {
    return await this.prisma.wallet.findFirst({
      where: {
        OR: [
          {
            id: unique,
          },
          {
            companieId: unique,
          },
        ],
      },
      include: {
        withdrawals: true,
      },
    });
  }

  public async update(
    data: CreateWalletDTO,
    tenantId: string,
  ): Promise<Wallet> {
    return await this.prisma.wallet.update({
      data: {
        ...data,
        companieId: tenantId,
        isVerified: true,
      },
      where: {
        companieId: tenantId,
      },
    });
  }

  public async toogle(walletId: string): Promise<{ updated: boolean }> {
    const wallet = await this.getByUnique(walletId);

    await this.prisma.wallet.update({
      data: {
        isVerified: {
          set: wallet?.isVerified,
        },
      },
      where: {
        id: walletId,
      },
    });
    return {
      updated: true,
    };
  }
}
