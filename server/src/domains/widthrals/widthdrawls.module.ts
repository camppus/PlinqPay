import { Module } from '@nestjs/common';
import { WithdrawalsController } from './widthdrawls.controller';
import { WidthdrawlService } from './widthdrawls.service';
import { TenantsPrismaRepositorie } from '../tenants/repositories/repos/tenantsPrismaRepo';
import { PrismaWalletRepositorie } from '../wallets/repositories/repos/PrismaWalletRepositorie';
import { PrismaWidthDrawlRepo } from './repositories/repos/PrismaWidthDrawlRepositorie';

@Module({
  controllers: [WithdrawalsController],
  providers: [
    WidthdrawlService,
    TenantsPrismaRepositorie,
    PrismaWalletRepositorie,
    PrismaWidthDrawlRepo
  ],
  exports: [WidthdrawlService],
})
export default class WidthdralModule {}
