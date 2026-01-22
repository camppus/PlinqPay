import {
  ITenantDefaultReturnType,
  ITenatsRepositories,
} from '@/domains/tenants/repositories/@type';
import { IWebhookRepositorie } from '../repositories/@type';
import { CreateWebhookDto } from '../dto/create.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class UpdateWebHookUseCase {
  constructor(
    private readonly WebhookRepo: IWebhookRepositorie,
    private readonly tenantRepo: ITenatsRepositories,
  ) {}

  public async execute(data: CreateWebhookDto, tenantId: string, id: string) {
    const [tenant, webhooks] = await Promise.all([
      this.tenantRepo.getByUnique(
        tenantId,
      ) as Promise<ITenantDefaultReturnType>,
      this.WebhookRepo.getById(id),
    ]);

    if (!webhooks) {
      throw new NotFoundException({
        message: 'Webhook não encontrado',
      });
    }
    if (tenantId !== webhooks.companieId) {
      throw new ForbiddenException({
        message: 'Webhook não te pertence',
      });
    }
    const updated = await this.WebhookRepo.update(data, tenant.data.id, id);
    return updated;
  }
}
