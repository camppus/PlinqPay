import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isArrayMappble(item: any) {
  return Array.isArray(item) && item.length > 0;
}

// lib/format.ts
export function formatCurrency(value: number | string) {
  return Number(value).toLocaleString("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  })
}
