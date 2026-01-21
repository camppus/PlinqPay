import { Injectable } from '@nestjs/common';
import { TenantsPrismaRepositorie } from './repositories/repos/tenantsPrismaRepo';
import { CreateCompanieDTo } from './dto/create.dto';
import CreateCompanieUseCase from './usecases/creatUseCase';
import JWT from '@/lib/shared/Jwt';
import { GetAllsTenantsUseCase } from './usecases/getAllUseCase';
import { ToogleTenanteUseCase } from './usecases/ToogleUseCase';
import UpdateCompanieUseCase from './usecases/updateUseCase';
import { DeleteTenanteUseCase } from './usecases/deleteUseCase';
import { UpdateTenantDTO } from './dto/updtae.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly repo: TenantsPrismaRepositorie) {}

  public async create(data: CreateCompanieDTo) {
    const createFacede = new CreateCompanieUseCase(this.repo);
    const created = await createFacede.execute(data);
    const tokenData = new JWT().sign(
      {
        role: created.role,
        sub: created.id,
      },
      {
        expiresIn: '14d',
      },
    );
    return {
      acessToken: tokenData,
      message: 'Verifique a sua conta',
      data: created,
    };
  }

  public async update(data: UpdateTenantDTO, id: string) {
    const createFacede = new UpdateCompanieUseCase(this.repo);
    const updated = await createFacede.execute(data, id);
    return {
      message: 'Verifique a sua conta',
      data: updated,
    };
  }

  public async getAll(cursor: number) {
    const getter = new GetAllsTenantsUseCase(this.repo);
    const tenants = await getter.getAll(cursor, 20);
    return tenants;
  }

  public async getByUnique(unique: string) {
    const getter = new GetAllsTenantsUseCase(this.repo);
    const tenants = await getter.getByUnique(unique);
    return tenants;
  }

  public async toogle(unique: string) {
    const togger = new ToogleTenanteUseCase(this.repo);
    const tenant = await togger.execute(unique);
    return tenant;
  }

  public async delete(unique: string) {
    const togger = new DeleteTenanteUseCase(this.repo);
    const tenant = await togger.execute(unique);
    return tenant;
  }
}
