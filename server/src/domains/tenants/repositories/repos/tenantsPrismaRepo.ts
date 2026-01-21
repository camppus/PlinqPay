import { Injectable } from '@nestjs/common';
import { ITenantDefaultReturnType, ITenatsRepositories } from '../@type';
import { Tenants } from '@prisma/client';
import { IPAginationGet } from '@/types';
import PrismaRepositorie from '@/infra/database/Prisma';
import { CreateCompanieDTo } from '../../dto/create.dto';
import { UpdateTenantDTO } from '../../dto/updtae.dto';

@Injectable()
export class TenantsPrismaRepositorie implements ITenatsRepositories {
  private readonly prisma = PrismaRepositorie.getInstance();

  public async create(
    data: CreateCompanieDTo,
  ): Promise<ITenantDefaultReturnType> {
    const createdCompanie = await this.prisma.tenants.create({
      data: {
        email: data.email,
        password: data.password,
        phone: data.phone,
        title: data.title,
        role: 'COMPANIE',
      },
    });
    return {
      data: createdCompanie,
    };
  }

  public async delete(id: string): Promise<ITenantDefaultReturnType | null> {
    const oldComanie = await this.getByUnique(id);

    if (!oldComanie) {
      return null;
    }
    const companie = await this.prisma.tenants.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },

      select: {
        createdAt: true,
        id: true,
        updatedAt: true,
        title: true,
        email: true,
        phone: true,
        isActive: true,
        isVerified: true,
        cursor: true,
      },
    });

    return {
      data: companie as Tenants,
    };
  }

  public async get(
    cursor: number,
    limit: number,
  ): Promise<IPAginationGet<Tenants>> {
    const tenants = await this.prisma.tenants.findMany({
      take: limit,
      select: {
        createdAt: true,
        id: true,
        updatedAt: true,
        title: true,
        email: true,
        phone: true,
        isActive: true,
        isVerified: true,
        cursor: true,
      },
      cursor: { cursor: cursor },
      orderBy: { cursor: 'asc' },
      where: {
        isActive: true,
        role: 'COMPANIE',
      },
    });
    return {
      data: tenants as Tenants[],
      total: tenants.length,
      pagination: {
        cursor,
        limit,
      },
    };
  }

  public async getByUnique(
    unique: string,
  ): Promise<ITenantDefaultReturnType | null> {
    const companie = await this.prisma.tenants.findFirst({
      where: {
        OR: [
          {
            id: unique,
          },
          {
            email: unique,
          },
          {
            phone: unique,
          },
        ],
      },
      select: {
        createdAt: true,
        id: true,
        updatedAt: true,
        title: true,
        email: true,
        phone: true,
        isActive: true,
        isVerified: true,
        cursor: true,
      },
    });
    return companie
      ? {
          data: companie as Tenants,
        }
      : null;
  }

  public async toogle(id: string): Promise<ITenantDefaultReturnType | null> {
    const oldComanie = await this.getByUnique(id);

    if (!oldComanie) {
      return null;
    }
    const companie = await this.prisma.tenants.update({
      where: {
        id,
      },
      data: {
        isActive: !oldComanie.data.isActive,
      },

      select: {
        createdAt: true,
        id: true,
        updatedAt: true,
        title: true,
        email: true,
        phone: true,
        isActive: true,
        isVerified: true,
        cursor: true,
      },
    });

    return {
      data: companie as Tenants,
    };
  }

  public async update(
    data: UpdateTenantDTO,
    id: string,
  ): Promise<ITenantDefaultReturnType | null> {
    const oldComanie = await this.getByUnique(id);
    if (!oldComanie) {
      return null;
    }
    const companie = await this.prisma.tenants.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        email: data.title,
        phone: data.phone,
      },

      select: {
        createdAt: true,
        id: true,
        updatedAt: true,
        title: true,
        email: true,
        phone: true,
        isActive: true,
        isVerified: true,
        cursor: true,
      },
    });
    return {
      data: companie as Tenants,
    };
  }
}
