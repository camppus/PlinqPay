import { BadRequestException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export default class JWT {
  private readonly secret = process.env.JWT_SECRET as string;

  public sign(text: any, option: jwt.SignOptions | undefined): string {
    return jwt.sign(text, this.secret, option);
  }

  public verify<T>(token: string): T {
    try {
      return jwt.verify(token, this.secret) as T;
    } catch (error) {
      throw new BadRequestException('token expirado ou inválido');
    }
  }
}
