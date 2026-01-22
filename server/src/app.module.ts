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
import { WebHookModule } from './domains/webhooks/webhook.module';
import { envSchema } from './types';
@Module({
  imports: [
    DatabaseModule,
    TenantsModule,
    AuthModule,
    TransactionModule,
    WebHookModule,
    APikeyModule,
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
