import { BadRequestException } from '@nestjs/common';
import z from 'zod';

export default class Email {
  constructor(private readonly text: string) {
    this.validate(this.text);
  }
  private validate(text: string) {
    try {
      z.object({
        email: z.email(),
      }).parse({
        email: text,
      });
    } catch (error) {
      throw new BadRequestException({
        message: 'Email inválido',
      });
    }
  }
  public getValue(): string {
    return this.text;
  }
}
