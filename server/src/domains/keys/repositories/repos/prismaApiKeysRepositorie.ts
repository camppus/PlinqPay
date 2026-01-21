import PrismaRepositorie from '@/infra/database/Prisma';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
        title: this.assignature.genApiTitle(),
        publicKey: this.assignature.genPublicKey(),
        secretKey: this.assignature.genSecretKey(),
        companieID: tenantId,
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
        companieID: tenantId,
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
    const apikeys = await this.prisma.apiSecretKeys.findMany({
      take: limit,
      skip: offest,
      select: {
        title: true,
        publicKey: true,
        companieID: true,
        id: true,
        isActive: true,
        updatedAt: true,
        createdAt: true,
      },
    });
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
    id: string,
  ): Promise<Omit<ApiSecretKeys, 'secretKey'> | null> {
    const apikey = await this.prisma.apiSecretKeys.findFirst({
      where: {
        id,
      },
      select: {
        title: true,
        publicKey: true,
        companieID: true,
        id: true,
        isActive: true,
        updatedAt: true,
        createdAt: true,
      },
    });
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
}
