import { Global, Module } from '@nestjs/common';
import { TenantsPrismaRepositorie } from './repositories/repos/tenantsPrismaRepo';
import { TenantsService } from './tenants.service';
import TennatsController from './tenants.controller';

@Global()
@Module({
  providers: [TenantsPrismaRepositorie, TenantsService],
  exports: [TenantsPrismaRepositorie, TenantsService],
  controllers: [TennatsController],
})
export default class TenantsModule {}
