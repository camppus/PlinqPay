import {
  ITenantDefaultReturnType,
  ITenatsRepositories,
} from '@/domains/tenants/repositories/@type';
import { IWebhookRepositorie } from '../repositories/@type';
import { CreateWebhookDto } from '../dto/create.dto';
import { BadRequestException } from '@nestjs/common';
import constants from '@/constants';

export class CreateWebhookUsecase {
  constructor(
    private readonly WebhookRepo: IWebhookRepositorie,
    private readonly tenantRepo: ITenatsRepositories,
  ) {}

  public async execute(data: CreateWebhookDto, tenantId: string) {
    const [tenant, webhooks] = await Promise.all([
      this.tenantRepo.getByUnique(
        tenantId,
      ) as Promise<ITenantDefaultReturnType>,
      this.WebhookRepo.getMyWebhooks(tenantId),
    ]);

    if (webhooks.data.length >= constants.MAX_WEB_HOOKS) {
      throw new BadRequestException({
        message: 'Atingui o limite de webhooks que podem ser criadoss',
      });
    }

    const newWebHook = await this.WebhookRepo.create(data, tenant.data.id);
    return {
      data: newWebHook,
    };
  }
}
