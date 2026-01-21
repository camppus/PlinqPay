import { Tenants } from '@prisma/client';

export interface AuthRepositorie {
  getTenant(email: string): Promise<Tenants | null>;
  reset();
}
