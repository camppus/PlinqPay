import { ApiSecretKeys, TaxType, Tenants } from '@prisma/client';
import z from 'zod';

const envSchema = z.object({});

export default envSchema;
export interface IPAginationGet<T> {
  data: T[];
  total: number;
  pagination: {
    cursor: number;
    limit: number;
  };
}

export interface IRepository<T> {
  getAll(page: number, limit: number): Promise<IPAginationGet<T>>;
  getAll(): Promise<{ data: T[] }>;
  getByUnique(unique: string): Promise<T | null>;
  create(data: any): Promise<T>;
  update(data: any, id: string): Promise<T>;
  delete(id: string): Promise<T>;
}

export interface IToken {
  role: string;
  sub: string;
}

export interface ITaxCalculator {
  amount: number;
  subtotal: number;
  tax: number;
  total: number;
  taxtType: TaxType;
}

export interface TaxCalculatorStrategie {
  calc(amount: number): number;
  getTax(): number;
}

export interface ICompaniesInfo {
  apikey: ApiSecretKeys;
  companie: Tenants;
}
