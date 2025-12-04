import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class PrismaRepositorie {
  static instace: PrismaClient | null = null;
  constructor() {}
  static getInstance(): PrismaClient {
    if (!PrismaRepositorie.instace) {
      PrismaRepositorie.instace = new PrismaClient();
    }
    return PrismaRepositorie.instace;
  }
}
