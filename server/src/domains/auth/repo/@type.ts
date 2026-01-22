import { Tenants } from '@prisma/client';

export interface AuthRepositorie {
  getTenant(unique: string): Promise<Tenants | null>;
  reset(password: string, tenantId: string): Promise<{ updated: boolean }>;
}
