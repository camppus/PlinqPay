import { ITaxCalculator, TaxCalculatorStrategie } from '@/types';
import { FixedTaxCalculator } from './strategies/fixed';
import { PercentTaxCalculator } from './strategies/percent';
import { BadRequestException } from '@nestjs/common';

export class TaxtCalculatorFactorie {
  private strategie: TaxCalculatorStrategie | undefined | null;

  private readonly taxtMapp: Record<
    'FIXED' | 'PERCENT',
    TaxCalculatorStrategie
  > = {
    FIXED: new FixedTaxCalculator(),
    PERCENT: new PercentTaxCalculator(),
  };
  constructor(private readonly taxType: 'FIXED' | 'PERCENT') {
    this.strategie = this.taxtMapp[taxType];
  }

  public calc(amount: number): ITaxCalculator {
    if (!this.strategie) {
      throw new BadRequestException({
        message: 'Estratégia de cálculo de taxa inválido',
      });
    }
    return {
      amount,
      tax: this.strategie.getTax(),
      subtotal: amount,
      total: this.strategie.calc(amount),
      taxtType: this.taxType,
    };
  }
}
