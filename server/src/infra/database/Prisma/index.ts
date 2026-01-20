import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export default class PrismaRepositorie implements OnModuleDestroy {
  protected readonly logger = new Logger('PRISMA');
  static instace: PrismaClient | null = null;
  constructor() {}
  static getInstance(): PrismaClient {
    if (!PrismaRepositorie.instace) {
      PrismaRepositorie.instace = new PrismaClient();
    }
    return PrismaRepositorie.instace;
  }
  async onModuleDestroy() {
    const repo = PrismaRepositorie.getInstance();
    await repo.$disconnect();
    this.logger.debug('PRISMA DB DESCONNECTED');
  }
}
