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
        isActive: true,
        isVerified: true,
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
    page: number,
    limit: number,
  ): Promise<IPAginationGet<Tenants>> {
    let total = 0;
    let verified = 0;
    let pending = 0;
    let blocked = 0;

    const skip = (page - 1) * limit;
    const [data, grouped] = await Promise.all([
      this.prisma.tenants.findMany({
        take: limit,
        skip,
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
          totalDisponible: true,
          totalErned: true,
        },
        orderBy: { createdAt: 'desc' },
        where: {
          role: 'COMPANIE',
        },
      }),
      await this.prisma.tenants.groupBy({
        by: ['isVerified', 'isActive'],
        _count: { id: true },
        where: {
          role: 'COMPANIE',
        },
      }),
    ]);

    grouped.forEach((g) => {
      total += g._count.id;

      if (g.isActive && g.isVerified) verified += g._count.id;
      else if (g.isActive && !g.isVerified) pending += g._count.id;
      else if (!g.isActive) blocked += g._count.id;
    });

    const totalPages = Math.ceil(total / limit);
    return {
      data: data as Tenants[],
      total: total,
      pagination: {
        page,
        limit,
        lastPage: totalPages,
      },
      stats: [
        {
          title: 'Total de Usuários',
          subtitle: 'Usuários cadastrados',
          description: 'Número total de usuários registrados na plataforma',
          amount: total,
          isCoin: false,
        },
        {
          title: 'Usuários Verificados',
          subtitle: 'KYC aprovado',
          description: 'Usuários com identidade verificada com sucesso',
          amount: verified,
          isCoin: false,
        },
        {
          title: 'Usuários Pendentes',
          subtitle: 'Aguardando verificação',
          description: 'Usuários que ainda não concluíram o KYC',
          amount: pending,
          isCoin: false,
        },
        {
          title: 'Usuários Bloqueados',
          subtitle: 'Contas suspensas',
          description: 'Usuários desativados por violação ou inatividade',
          amount: blocked,
          isCoin: false,
        },
      ],
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
      include: {
        wallet: true,
      },
    });

    return companie
      ? {
          data: { ...companie, password: '' } as Tenants,
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
        isVerified: !oldComanie.data.isVerified,
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
        email: data.email,
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
