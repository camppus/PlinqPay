import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import DatabaseModule from './infra/database/database.module';
import TenantsModule from './domains/tenants/tenants.module';
import { ConfigModule } from '@nestjs/config';
import { APikeyModule } from './domains/keys/key.module';
import { ThrottlerModule } from '@nestjs/throttler';
import AuthModule from './domains/auth/auth.module';
import AuthMiddleare from './middlewares/auth.middleware';
import { TransactionModule } from './domains/transactions/transaction.module';
import { envSchema } from './types';
import { WalletModule } from './domains/wallets/wallets.module';
import WidthdralModule from './domains/widthrals/widthdrawls.module';
import { TaxModule } from './domains/tax/tax.module';
import { NotificationsModule } from './domains/notifications/notification.module';
@Module({
  imports: [
    DatabaseModule,
    TenantsModule,
    AuthModule,
    TransactionModule,
    APikeyModule,
    WalletModule,
    WidthdralModule,
    TaxModule,
    NotificationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config) {
        envSchema.parse(config);
        return config;
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 10,
          ttl: 60,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleare)
      .exclude({
        method: RequestMethod.ALL,
        path: '/v1/tax',
      })
      .exclude({
        method: RequestMethod.POST,
        path: '/v1/auth/login',
      })
      .exclude({
        method: RequestMethod.POST,
        path: '/v1/tenants',
      })
      .exclude({
        method: RequestMethod.POST,
        path: '/v1/transaction',
      })
      .exclude({
        method: RequestMethod.POST,
        path: '/v1/transaction/notify',
      })
      .forRoutes('*');
  }
}
