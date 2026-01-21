import { Tenants } from '@prisma/client';
import { IPAginationGet } from '@/types';
import { CreateCompanieDTo } from '../dto/create.dto';
import { UpdateTenantDTO } from '../dto/updtae.dto';

export type ITenantDefaultReturnType = {
  data: Omit<Tenants, 'password'>;
};

export interface ITenatsRepositories {
  create(data: CreateCompanieDTo): Promise<ITenantDefaultReturnType>;
  update(
    data: UpdateTenantDTO,
    id: string,
  ): Promise<ITenantDefaultReturnType | null>;
  delete(id: string): Promise<ITenantDefaultReturnType | null>;
  toogle(id: string): Promise<ITenantDefaultReturnType | null>;

  getByUnique(unique: string): Promise<ITenantDefaultReturnType | null>;
  get(cursor: number, limit: number): Promise<IPAginationGet<Tenants>>;
}
