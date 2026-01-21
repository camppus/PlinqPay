import { IPAginationGet } from '@/types';
import { ApiSecretKeys } from '@prisma/client';

export type APiReturnDefaultType = {
  data: ApiSecretKeys | null;
};
export interface ApiKeyRepositorie {
  getAll(
    page: number,
    limit: number,
  ): Promise<IPAginationGet<Omit<ApiSecretKeys, 'secretKey'>>>;
  getById(id: string): Promise<Omit<ApiSecretKeys, 'secretKey'> | null>;
  create(tenantId: string): Promise<APiReturnDefaultType>;
  toogle(id: string): Promise<{ status: boolean }>;
  getKeyByTenantId(id: string): Promise<ApiSecretKeys | null>;
}
