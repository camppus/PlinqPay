import { BadRequestException } from '@nestjs/common';
import { ApiKeyRepositorie } from '../repositories/@types';
import constants from '@/constants';

export default class CreateApiKeyUseCase {
  constructor(private readonly repo: ApiKeyRepositorie) {}

  public async execute(tenantId: string, title: string) {
    const hasKeys = await this.repo.getKeyByTenantId(tenantId);

    if (hasKeys && hasKeys.length > constants.MAX_API_KEYS) {
      throw new BadRequestException({
        message: `No máximo ${constants.MAX_API_KEYS} chaves por conta`,
      });
    }
    const createdApiKey = await this.repo.create(tenantId, title);
    return createdApiKey;
  }
}
