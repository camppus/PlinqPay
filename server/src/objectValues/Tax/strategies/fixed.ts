import { TaxCalculatorStrategie } from '@/types';

export class FixedTaxCalculator implements TaxCalculatorStrategie {
  private readonly fixedValue = 1000;

  calc(amount: number): number {
    return amount - this.fixedValue;
  }

  getTax(): number {
    return this.fixedValue;
  }
}
