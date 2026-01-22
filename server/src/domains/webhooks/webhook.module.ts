import { Module } from '@nestjs/common';
import { WebhooksService } from './webhook.service';
import PrismaWebhookRepositorie from './repositories/repos/PrismaWebhooksRepositorie';
import { TenantsPrismaRepositorie } from '../tenants/repositories/repos/tenantsPrismaRepo';
import { WebHooksController } from './webhook.controller';

@Module({
  exports: [
    WebhooksService,
    PrismaWebhookRepositorie,
    TenantsPrismaRepositorie,
  ],
  controllers: [WebHooksController],
  providers: [
    WebhooksService,
    PrismaWebhookRepositorie,
    TenantsPrismaRepositorie,
  ],
})
export class WebHookModule {}
