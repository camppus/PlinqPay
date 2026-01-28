import { Injectable } from '@nestjs/common';
import { PrismaAPiKeyRepositorie } from './repositories/repos/prismaApiKeysRepositorie';
import { TenantsPrismaRepositorie } from '../tenants/repositories/repos/tenantsPrismaRepo';
import CreateApiKeyUseCase from './useCases/createUsecase';
import GetApiKeyUseCase from './useCases/getUseCase';
import ToogleApiKeyUseCase from './useCases/toogleUsecase';
import { ApiSecretKeys } from '@prisma/client';

@Injectable()
export default class ApiKeyService {
  constructor(
    private readonly apiKeyRepo: PrismaAPiKeyRepositorie,
    private readonly tenantRepo: TenantsPrismaRepositorie,
  ) {}

  public async toogle(tenantId: string, userId: string) {
    const toogler = new ToogleApiKeyUseCase(this.apiKeyRepo);
    return await toogler.execute(tenantId, userId);
  }

  public async create(tenantId: string, title: string) {
    const creater = new CreateApiKeyUseCase(this.apiKeyRepo);
    return await creater.execute(tenantId, title);
  }

  public async get(page: number = 1, limit = 20, tenantId: string) {
    const getter = new GetApiKeyUseCase(this.apiKeyRepo, this.tenantRepo);
    const res = await getter.get(page, limit, tenantId);
    if (!res) {
      return {
        data: [],
      };
    }

    const keys = res as ApiSecretKeys[];
    const noSecretKeys = keys.map((item) => {
      return {
        ...item,
        secretKey: 'Já foi vista',
      };
    });
    return noSecretKeys;
  }
}
