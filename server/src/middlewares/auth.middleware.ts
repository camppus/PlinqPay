import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import JWT from '@/lib/shared/Jwt';
import { IToken } from '@/types';
export default class AuthMiddleare implements NestMiddleware {
  private readonly jwt = new JWT();
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new BadRequestException({
        message: 'authorization header não informado',
      });
    }

    const [type, token] = authHeader.split(' ');

    if (!token) {
      throw new BadRequestException({
        message: 'Token não enviado',
      });
    }
    const decodedToken = this.jwt.verify<IToken>(token);
    req.headers['x-user-id'] = decodedToken?.sub;
    next();
    return;
  }
}
