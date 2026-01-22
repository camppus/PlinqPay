import { Module } from '@nestjs/common';
import TrasanctionService from './transaction.service';
import { PrismaTransactionRepositorie } from './repositories/repos/PrismaTransactionRepositorie';
import { TransactionController } from './transaction.controller';
import { PrismaAPiKeyRepositorie } from '../keys/repositories/repos/prismaApiKeysRepositorie';

@Module({
  providers: [
    TrasanctionService,
    PrismaTransactionRepositorie,
    PrismaAPiKeyRepositorie,
  ],
  exports: [TrasanctionService, PrismaTransactionRepositorie],
  controllers: [TransactionController],
})
export class TransactionModule {}
