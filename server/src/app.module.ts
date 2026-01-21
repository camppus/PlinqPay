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
@Module({
  imports: [
    DatabaseModule,
    TenantsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config) {
        return config;
      },
    }),
    APikeyModule,
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
      .forRoutes('*');
  }
}
