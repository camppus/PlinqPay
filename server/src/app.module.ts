import { Module } from '@nestjs/common';
import DatabaseModule from './infra/database/database.module';
import TenantsModule from './domains/tenants/tenants.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    DatabaseModule,
    TenantsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config) {
        return config;
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
