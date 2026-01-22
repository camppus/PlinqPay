import { IPAginationGet } from '@/types';
import { WebHooks } from '@prisma/client';
import { CreateWebhookDto } from '../dto/create.dto';

export interface IWebhookRepositorie {
  create(data: CreateWebhookDto, tenantId: string): Promise<WebHooks>;
  getMyWebhooks(tenantId: string): Promise<IPAginationGet<WebHooks[]>>;
  deleteWebHook(webhookId: string): Promise<WebHooks>;
  update(
    ddata: CreateWebhookDto,
    tenantId: string,
    webHookId: string,
  ): Promise<{
    updated: boolean;
  }>;
  getAllWebhooks(
    page: number,
    limit: number,
  ): Promise<IPAginationGet<WebHooks[]>>;
  getMyWebhooks(tenantId: string): Promise<IPAginationGet<WebHooks[]>>;
  getById(id: string): Promise<WebHooks | null>;
}
