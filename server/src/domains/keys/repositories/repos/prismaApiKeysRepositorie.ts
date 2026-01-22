import PrismaRepositorie from '@/infra/database/Prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiKeyRepositorie, APiReturnDefaultType } from '../@types';
import Assignature from '@/lib/shared/Assignature';
import { IPAginationGet } from '@/types';
import { ApiSecretKeys } from '@prisma/client';

@Injectable()
export class PrismaAPiKeyRepositorie implements ApiKeyRepositorie {
  private readonly prisma = PrismaRepositorie.getInstance();
  private readonly assignature = new Assignature();
  public async create(tenantId: string): Promise<APiReturnDefaultType> {
    const newApiKey = await this.prisma.apiSecretKeys.create({
      data: {
        title: 'api_',
        publicKey: this.assignature.genPublicKey(),
        secretKey: this.assignature.genSecretKey(),
        companieId: tenantId,
        isActive: true,
      },
    });
    return {
      data: newApiKey,
    };
  }
  public async getKeyByTenantId(tenantId: string) {
    return this.prisma.apiSecretKeys.findFirst({
      where: {
        companieId: tenantId,
      },
      include: {
        companie: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    });
  }
  public async getAll(
    page: number,
    limit: number,
  ): Promise<IPAginationGet<Omit<ApiSecretKeys, 'secretKey'>>> {
    const offest = (page - 1) * limit;
    const apikeys = (await this.prisma.apiSecretKeys.findMany({
      take: limit,
      skip: offest,
      select: {
        title: true,
        publicKey: true,
        companieId: true,
        id: true,
        isActive: true,
        updatedAt: true,
        createdAt: true,
      },
    })) as any as ApiSecretKeys[];
    return {
      data: apikeys,
      pagination: {
        cursor: page,
        limit,
      },
      total: apikeys.length,
    };
  }
  public async getById(
    unique: string,
  ): Promise<Omit<ApiSecretKeys, 'secretKey'> | null> {
    const apikey = (await this.prisma.apiSecretKeys.findFirst({
      where: {
        OR: [
          {
            id: unique,
          },
          {
            publicKey: unique,
          },
        ],
      },
      select: {
        title: true,
        publicKey: true,
        id: true,
        isActive: true,
        updatedAt: true,
        createdAt: true,
        companieId: true,
      },
    })) as Omit<ApiSecretKeys, 'secretKey'>;
    if (!apikey) {
      return null;
    }
    return apikey;
  }
  public async toogle(id: string): Promise<{ status: boolean }> {
    const apiKey = await this.getById(id);
    if (!apiKey) {
      throw new NotFoundException({
        message: 'A chave da api não foi encontrada',
      });
    }
    const updated = await this.prisma.apiSecretKeys.update({
      where: {
        id,
      },
      data: {
        isActive: !apiKey.isActive,
      },
    });

    return {
      status: updated?.isActive,
    };
  }

  public async getByPublickKey(unique: string): Promise<ApiSecretKeys | null> {
    const apikey = await this.prisma.apiSecretKeys.findFirst({
      where: {
        publicKey: unique,
      },
    });
    if (!apikey) {
      return null;
    }
    return apikey;
  }
}
