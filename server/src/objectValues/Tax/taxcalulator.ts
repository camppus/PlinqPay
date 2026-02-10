import { ITaxCalculator, TaxCalculatorStrategie } from '@/types';
import { FixedTaxCalculator } from './strategies/fixed';
import { PercentTaxCalculator } from './strategies/percent';
import { BadRequestException } from '@nestjs/common';

type TaxType = 'FIXED' | 'PERCENT';

export class TaxCalculatorFactory {
  private readonly strategy: TaxCalculatorStrategie;
  constructor(private readonly taxType: TaxType) {}

  public calc(amount: number): ITaxCalculator {
  const taxa = 0.03;

  if (amount <= 0) {
    throw new BadRequestException(
      'O valor da transação deve ser maior que zero',
    );
  }

  if (amount > 10_000) {
    throw new BadRequestException(
      'Limite de 10.000,00 kz por transação',
    );
  }

  const tax = amount * taxa;
  const total = amount - tax;

  if (total <= 0) {
    throw new BadRequestException(
      'O valor final não pode ser menor ou igual a zero',
    );
  }

  return {
    amount,
    tax,
    subtotal: amount,
    total,
    taxtType: 'PERCENT',
  };
}

  

}
