import { IWebhookRepositorie } from '../repositories/@type';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeteleWebHookUseCase {
  constructor(private readonly WebhookRepo: IWebhookRepositorie) {}

  public async execute(id: string, tenantId: string) {
    const [webhooks] = await Promise.all([this.WebhookRepo.getById(id)]);

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
    return await this.WebhookRepo.deleteWebHook(id);
  }
}
