import { Injectable } from '@nestjs/common';
import { AuthRepositorie } from '../@type';
import PrismaRepositorie from '@/infra/database/Prisma';
import { Tenants } from '@prisma/client';

@Injectable()
export default class PrismaAUthRepositorie implements AuthRepositorie {
  private readonly prisma = PrismaRepositorie.getInstance();

  reset() { }
  
  public async getTenant(email: string): Promise<Tenants | null> {
    return await this.prisma.tenants.findFirst({
      where: {
        email,
      },
    });
  }
}
