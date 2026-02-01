import { Wallet, Withdrawals } from '@prisma/client';
import { CreateWidthrawlDto } from '../dto/create.dto';
import { IPAginationGet } from '@/types';

export interface IWidthdrawsRepositories {
  create(
    dto: CreateWidthrawlDto,
    tetantId: string,
    wallet: Wallet,
  ): Promise<Withdrawals>;
  getAll(page: number, limit: number): Promise<IPAginationGet<Withdrawals[]>>;
  getById(id: string): Promise<Withdrawals | null>;
  getAllBytenant(
    page: number,
    limit: number,
    id: string,
  ): Promise<IPAginationGet<Withdrawals[]>>;
  getAllBytenantPendings(id: string): Promise<number>;
}
