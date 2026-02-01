import PrismaRepositorie from '@/infra/database/Prisma';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export default class IsApiKeyAbleToProcessPaymentGuard implements CanActivate {
  private readonly prisma = PrismaRepositorie.getInstance();
  private readonly logger = new Logger('ApiKeyVerifier');
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const headers = Object.keys(request.headers).reduce<Record<string, string>>(
      (acc, key) => {
        const value = request.headers[key];
        if (Array.isArray(value)) {
          acc[key.toLowerCase()] = value[0];
        } else if (value) {
          acc[key.toLowerCase()] = value;
        }
        return acc;
      },
      {},
    );
    const apiKey = headers['api-key'];
    const ip = headers['x-forwarded-for']?.split(',')[0] || request.ip;
    return await this.validateIfIsAdmin(apiKey, ip as string);
  }

  private async validateIfIsAdmin(apiKey: string, ip: string) {
    if (!apiKey) {
      this.logger.fatal('MiSSING API_kEY -> ', ip, this.getDateMessage());
      throw new BadRequestException({
        message: 'Apikey em falta',
        apiKey,
        ip,
      });
    }

    const savedApiKey = await this.prisma.apiSecretKeys.findFirst({
      where: {
        publicKey: apiKey,
      },
      include: {
        companie: true,
      },
    });

    if (!savedApiKey) {
      this.logger.fatal('NO EXISTEN API_kEY -> ', ip, this.getDateMessage());
      throw new BadRequestException({
        message: 'ApiKey não encontrada',
        apiKey,
        ip,
      });
    }

    if (!savedApiKey?.isActive) {
      this.logger.fatal('DESACTIVE API_kEY -> ', ip, this.getDateMessage());
      throw new BadRequestException({
        message: 'ApiKey desativada pelo adimintrador',
        apiKey,
        ip,
      });
    }

    if (
      !savedApiKey?.companie?.isActive ||
      !savedApiKey?.companie?.isVerified
    ) {
      this.logger.fatal(
        'NOT VERIFIED PROFILE API_kEY -> ',
        ip,
        this.getDateMessage(),
      );
      throw new BadRequestException({
        message: 'Verifica a sua conta para que possas excutar esta acção',
        apiKey,
        ip,
      });
    }

    this.logger.verbose('VALID API_KEY -> ', ip, this.getDateMessage());
    return true;
  }

  private getDateMessage() {
    const now = new Date();
    return ` at ${now.toLocaleDateString('pt')} and ${now.toLocaleTimeString('pt')}`;
  }
}
