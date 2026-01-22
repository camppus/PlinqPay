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
    const apiKey = request.headers['api-key'] as string;
    return await this.validateIfIsAdmin(apiKey, request.ip as string);
  }

  private async validateIfIsAdmin(apiKey: string, ip: string) {
    this.logger.fatal(
      'ACESSING PAYMENTPROCESSOR -> ',
      ip,
      this.getDateMessage(),
    );
    if (!apiKey) {
      this.logger.fatal('MiSSING API_kEY -> ', ip, this.getDateMessage());
      throw new BadRequestException({
        message: 'Apikey em falta',
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
      });
    }

    if (!savedApiKey?.isActive) {
      this.logger.fatal('DESACTIVE API_kEY -> ', ip, this.getDateMessage());
      throw new BadRequestException({
        message: 'ApiKey desativada pelo adimintrador',
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
