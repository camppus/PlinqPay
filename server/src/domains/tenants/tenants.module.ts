import { Global, Module } from '@nestjs/common';
import { TenantsPrismaRepositorie } from './repositories/repos/tenantsPrismaRepo';
import { TenantsService } from './tenants.service';

@Global()
@Module({
  providers: [TenantsPrismaRepositorie, TenantsService],
  exports: [TenantsPrismaRepositorie, TenantsService],
})
export default class TenantsModule {}
