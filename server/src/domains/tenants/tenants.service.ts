import { Injectable } from '@nestjs/common';
import { TenantsPrismaRepositorie } from './repositories/repos/tenantsPrismaRepo';
import { CreateCompanieDTo } from './dto/create.dto';
import CreateCompanieUseCase from './usecases/creatUseCase';

@Injectable()
export class TenantsService {
  constructor(private readonly repo: TenantsPrismaRepositorie) {}
  public async create(data: CreateCompanieDTo) {
    const createFacede = new CreateCompanieUseCase(this.repo);
    const created = await createFacede.execute(data);
    return created;
  }
}
