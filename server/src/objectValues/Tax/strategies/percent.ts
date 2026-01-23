import constants from '@/constants';
import { TaxCalculatorStrategie } from '@/types';

export class PercentTaxCalculator implements TaxCalculatorStrategie {
  private readonly percent = constants.TAX;

  calc(amount: number): number {
    return amount * this.percent;
  }

  getTax(): number {
    return this.percent * 100;
  }
}
