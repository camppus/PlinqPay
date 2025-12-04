import { BadRequestException } from '@nestjs/common';
import z from 'zod';
import dns from 'node:dns';

export default class Email {
  constructor(private readonly text: string) {
    this.dnsCheker(this.text);
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
  private dnsCheker(email: string): void {
    dns.resolveMx(email, (err, address) => {
      if (err || address.length <= 0) {
        throw new BadRequestException('Domínio de email não existe');
      }
    });
  }
  public getValue(): string {
    return this.text;
  }
}
