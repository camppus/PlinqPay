import { Module } from '@nestjs/common';
import DatabaseModule from './infra/database/database.module';
import TenantsModule from './domains/tenants/tenants.module';

@Module({
  imports: [DatabaseModule, TenantsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
