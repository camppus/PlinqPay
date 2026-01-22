import { TaxCalculatorStrategie } from '@/types';

export class PercentTaxCalculator implements TaxCalculatorStrategie {
  private readonly percent = 0.1;

  calc(amount: number): number {
    return amount * this.percent;
  }

  getTax(): number {
    return this.percent * 100;
  }
}
