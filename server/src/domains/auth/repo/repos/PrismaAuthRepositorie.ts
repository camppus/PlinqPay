import { Injectable } from '@nestjs/common';
import { AuthRepositorie } from '../@type';
import PrismaRepositorie from '@/infra/database/Prisma';
import { Tenants } from '@prisma/client';

@Injectable()
export default class PrismaAUthRepositorie implements AuthRepositorie {
  private readonly prisma = PrismaRepositorie.getInstance();

  public async reset(password: string, tenantId: string) {
    const updated = await this.prisma.tenants.update({
      where: {
        id: tenantId,
      },
      data: {
        password,
      },
    });
    return {
      updated: updated?.id ? true : false,
    };
  }

  public async getTenant(unique: string): Promise<Tenants | null> {
    return await this.prisma.tenants.findFirst({
      where: {
        OR: [
          {
            email: unique,
          },
          {
            id: unique,
          },
          {
            phone: unique,
          },
        ],
      },
    });
  }
}
