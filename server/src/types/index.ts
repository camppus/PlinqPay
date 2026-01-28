import { ApiSecretKeys, TaxType, Tenants } from '@prisma/client';
import z from 'zod';

export interface IPAginationGet<T> {
  data: T[];
  total: number;
  pagination: {
    limit: number;
    page: number;
    lastPage: number;
  };
  stats?: any;
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

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),

  ADMINEMAIL: z.string().email(),
  ADMINPASS: z.string().min(8),

  EMAIL_HOST: z.string(),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string().min(8),
  EMAIL_PORT: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'EMAIL_PORT must be a positive number',
    }),

  PATHERID: z.string(),

  GETAWAY_API: z.string().url(),
  GETAWAY_NOTIFY_SECRET: z.string().min(32),

  PRIVATE_KEY: z.string().min(300),
  PUBLIC_KEY: z.string().min(200),

  PORT: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'PORT must be a positive number',
    }),

  RESETLINK: z.string().url(),

  SMS_FROM: z.string(),
  SMS_ID: z.string(),
  SMS_KEY: z.string().min(32),
  SMS_URL_API: z.string().url(),
});
