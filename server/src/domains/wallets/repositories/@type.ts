import { IPAginationGet } from '@/types';
import { Prisma, Wallet } from '@prisma/client';
import { CreateWalletDTO } from '../dto/create.dto';

export type WalletType = Prisma.WalletGetPayload<{
  include: {
    withdrawals: true;
  };
}>;
export interface IWalletRepositorie {
  create(data: CreateWalletDTO, tenantId: string): Promise<Wallet>;
  update(data: CreateWalletDTO, tenantId: string): Promise<Wallet>;
  getByUnique(tenantId: string): Promise<WalletType | null>;
  getAll(page: number, limit: number): Promise<IPAginationGet<Wallet[]>>;
  toogle(walletId: string): Promise<{ updated: boolean }>;
}
