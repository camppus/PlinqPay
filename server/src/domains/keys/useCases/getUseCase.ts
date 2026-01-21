import { TenantsPrismaRepositorie } from '@/domains/tenants/repositories/repos/tenantsPrismaRepo';
import { ApiKeyRepositorie } from '../repositories/@types';
import { NotFoundException } from '@nestjs/common';

export default class GetApiKeyUseCase {
  constructor(
    private readonly repo: ApiKeyRepositorie,
    private readonly tenantRepo: TenantsPrismaRepositorie,
  ) {}

  private async getAll(page: number, limit: number) {
    return await this.repo.getAll(page, limit);
  }
  private async getById(id: string) {
    return await this.repo.getById(id);
  }

  public async getByTenantId(id: string) {
    return await this.repo.getKeyByTenantId(id);
  }

  public async get(page: number, limit: number, tenantId: string) {
    const tenant = await this.tenantRepo.getByUnique(tenantId);
    if (!tenant) {
      throw new NotFoundException({
        message: 'Empresa não encontrada',
      });
    }
    const { data: Companie } = tenant;
    const isAdmin = Companie.role == 'SUPERCOMPANIE';
    if (isAdmin) {
      return await this.getAll(page, limit);
    }
    return await this.getByTenantId(Companie.id);
  }
}
