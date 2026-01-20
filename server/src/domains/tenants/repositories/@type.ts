import { Tenants } from '@prisma/client';
import { IPAginationGet } from '@/types/interface';
import { CreateCompanieDTo } from '../dto/create.dto';

export type ITenantDefaultReturnType = {
  data: Omit<Tenants, 'password'>;
};

export interface ITenatsRepositories {
  create(data: CreateCompanieDTo): Promise<ITenantDefaultReturnType>;
  update(
    data: Omit<CreateCompanieDTo, 'password'>,
    id: string,
  ): Promise<ITenantDefaultReturnType | null>;
  delete(id: string): Promise<ITenantDefaultReturnType | null>;
  toogle(id: string): Promise<ITenantDefaultReturnType | null>;

  getByUnique(unique: string): Promise<ITenantDefaultReturnType | null>;
  get(cursor: number, limit: number): Promise<IPAginationGet<Tenants>>;
}
