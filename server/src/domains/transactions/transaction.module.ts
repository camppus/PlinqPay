import { Module } from '@nestjs/common';
import TrasanctionService from './transaction.service';
import { PrismaTransactionRepositorie } from './repositories/repos/PrismaTransactionRepositorie';
import { TransactionController } from './transaction.controller';
import { PrismaAPiKeyRepositorie } from '../keys/repositories/repos/prismaApiKeysRepositorie';
import { TenantsService } from '../tenants/tenants.service';

@Module({
  providers: [
    TrasanctionService,
    PrismaTransactionRepositorie,
    PrismaAPiKeyRepositorie,
    TenantsService
  ],
  exports: [TrasanctionService, PrismaTransactionRepositorie],
  controllers: [TransactionController],
})
export class TransactionModule {}
