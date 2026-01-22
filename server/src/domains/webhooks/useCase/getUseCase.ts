import { IWebhookRepositorie } from '../repositories/@type';

export class GetWebHook {
  constructor(private readonly WebhookRepo: IWebhookRepositorie) {}

  public async getByTenant(tenantId: string) {
    return await this.WebhookRepo.getMyWebhooks(tenantId);
  }

  public async getAlls(page: number, limit: number) {
    return await this.WebhookRepo.getAllWebhooks(page, limit);
  }
}
