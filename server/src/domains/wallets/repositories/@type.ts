import { IPAginationGet } from '@/types';
import { Wallet } from '@prisma/client';
import { CreateWalletDTO } from '../dto/create.dto';

export interface IWalletRepositorie {
  create(data: CreateWalletDTO, tenantId: string): Promise<Wallet>;
  update(data: CreateWalletDTO, tenantId: string): Promise<Wallet>;
  getByUnique(tenantId: string): Promise<Wallet | null>;
  getAll(page: number, limit: number): Promise<IPAginationGet<Wallet[]>>;
  toogle(walletId: string): Promise<{ updated: boolean }>;
}
