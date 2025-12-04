import { Injectable } from '@nestjs/common';
import { ITenantDefaultReturnType, ITenatsRepositories } from '../@type';
import { Companies } from '@prisma/client';
import { IPAginationGet } from '@/types/interface';
import PrismaRepositorie from '@/infra/database/Prisma';
import { CreateCompanieDTo } from '../../dto/create.dto';

@Injectable()
export class TenantsPrismaRepositorie implements ITenatsRepositories {
  private readonly prisma = PrismaRepositorie.getInstance();

  public async create(
    data: CreateCompanieDTo,
  ): Promise<ITenantDefaultReturnType> {
    const createdCompanie = await this.prisma.companies.create({
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
    const companie = await this.prisma.companies.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    return {
      data: companie,
    };
  }

  public async get(
    cursor: number,
    limit: number,
  ): Promise<IPAginationGet<Companies>> {
    const companies = await this.prisma.companies.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: { cursor: cursor },
      orderBy: { cursor: 'asc' },
      where: {
        isActive: true,
      },
    });
    return {
      data: companies,
      total: companies.length,
      pagination: {
        cursor,
        limit,
      },
    };
  }

  public async getByUnique(
    unique: string,
  ): Promise<ITenantDefaultReturnType | null> {
    const companie = await this.prisma.companies.findFirst({
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
    });
    return companie
      ? {
          data: companie,
        }
      : null;
  }

  public async toogle(id: string): Promise<ITenantDefaultReturnType | null> {
    const oldComanie = await this.getByUnique(id);

    if (!oldComanie) {
      return null;
    }
    const companie = await this.prisma.companies.update({
      where: {
        id,
      },
      data: {
        isActive: !oldComanie.data.isActive,
      },
    });

    return {
      data: companie,
    };
  }

  public async update(
    data: Omit<CreateCompanieDTo, 'password'>,
    id: string,
  ): Promise<ITenantDefaultReturnType | null> {
    const oldComanie = await this.getByUnique(id);
    if (!oldComanie) {
      return null;
    }
    const companie = await this.prisma.companies.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        email: data.title,
        phone: data.phone,
      },
    });
    return {
      data: companie,
    };
  }
}
