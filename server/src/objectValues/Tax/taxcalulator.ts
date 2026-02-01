import { ITaxCalculator, TaxCalculatorStrategie } from '@/types';
import { FixedTaxCalculator } from './strategies/fixed';
import { PercentTaxCalculator } from './strategies/percent';
import { BadRequestException } from '@nestjs/common';

type TaxType = 'FIXED' | 'PERCENT';

export class TaxCalculatorFactory {
  private readonly strategy: TaxCalculatorStrategie;

  private readonly taxMap: Record<TaxType, TaxCalculatorStrategie> = {
    FIXED: new FixedTaxCalculator(),
    PERCENT: new PercentTaxCalculator(),
  };

  constructor(private readonly taxType: TaxType) {
    const strategy = this.taxMap[taxType];
    if (!strategy) {
      throw new BadRequestException('Estratégia de cálculo de taxa inválida');
    }

    this.strategy = strategy;
  }

  public calc(amount: number): ITaxCalculator {
    if (amount <= 0) {
      throw new BadRequestException(
        'O valor da transação deve ser maior que zero',
      );
    }
    const tax = this.strategy.getTax();
    if (amount <= tax) {
      throw new BadRequestException(
        'O valor da transação deve ser maior que a taxa aplicada',
      );
    }
    const total = this.strategy.calc(amount);
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
