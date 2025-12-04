import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export default class PhoneNumber {
  private readonly angolaPhoneSchema = z.string().refine(
    (value) => {
      return isValidPhoneNumber(value, 'AO');
    },
    {
      message: 'Número de telefone de Angola inválido (ex: +2449xxxxxxxx)',
    },
  );
  constructor(private readonly text: string) {
    this.validate(this.text);
  }

  public getValue(): string {
    return this.text;
  }

  private validate(text: string) {
    this.angolaPhoneSchema.parse('+244923123456');
  }
}
