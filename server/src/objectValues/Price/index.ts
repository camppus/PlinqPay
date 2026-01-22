import { BadRequestException } from '@nestjs/common';

export class Price {
  constructor(
    private readonly price: number,
    private readonly quantity: number,
  ) {
    this.validate();
  }
  private validate(): void {
    if (this.price <= 0) {
      throw new BadRequestException({
        message: 'Preço não pode ser negativo ou neutro',
      });
    }
  }

  public getValue(): number {
    return this.price * this.quantity;
  }
}

export class PriceValidator {
  private totalAmount: number = 0;

  constructor(
    private readonly prices: Price[],
    private readonly wishisgValue: number,
  ) {
    this.validate();
  }

  private validate(): void {
    this.prices.forEach((item) => {
      this.totalAmount += item.getValue();
    });

    if (this.totalAmount != this.wishisgValue) {
      throw new BadRequestException({
        message: 'Os preços não batem com a lista de produtos',
        totalAmount: this.totalAmount,
        amountGiven: this.wishisgValue,
      });
    }
  }
}
