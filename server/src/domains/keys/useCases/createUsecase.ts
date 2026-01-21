import { ConflictException } from '@nestjs/common';
import { ApiKeyRepositorie } from '../repositories/@types';

export default class CreateApiKeyUseCase {
  constructor(private readonly repo: ApiKeyRepositorie) {}

  public async execute(tenantId: string) {
    await this.hasApiKey(tenantId);
    const createdApiKey = await this.repo.create(tenantId);
    return createdApiKey;
  }
  private async hasApiKey(tenantId: string): Promise<void> {
    const has = await this.repo.getKeyByTenantId(tenantId);
    if (has) {
      throw new ConflictException({
        message: 'A empresa ja possui uma apikey',
      });
    }
  }
}
