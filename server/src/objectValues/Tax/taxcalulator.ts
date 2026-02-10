import { ITaxCalculator, TaxCalculatorStrategie } from '@/types';
import { FixedTaxCalculator } from './strategies/fixed';
import { PercentTaxCalculator } from './strategies/percent';
import { BadRequestException } from '@nestjs/common';

type TaxType = 'FIXED' | 'PERCENT';

export class TaxCalculatorFactory {
  private readonly strategy: TaxCalculatorStrategie;
  constructor(private readonly taxType: TaxType) {}

  public calc(amount: number): ITaxCalculator {
    if (amount <= 0) {
      throw new BadRequestException(
        'O valor da transação deve ser maior que zero',
      );
    }
    const percent = new PercentTaxCalculator()
    const tax = percent.getTax();
    const taxValue = this.strategy.calc(amount);
    
    if (amount <= tax) {
      throw new BadRequestException(
        'O valor da transação deve ser maior que a taxa aplicada',
      );
    }
    const total = amount - taxValue;
    if (total >= 10_000) {
      throw new BadRequestException({
        message: 'Limite de 100.000,00 kz por trasnsação',
      });
    }
    return {
      amount,
      tax,
      subtotal: amount,
      total,
      taxtType: 'FIXED',
    };
  }
}
