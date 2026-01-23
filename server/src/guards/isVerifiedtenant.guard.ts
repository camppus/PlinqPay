import PrismaRepositorie from '@/infra/database/Prisma';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export default class IsTenantVerifiedGuard implements CanActivate {
  private readonly prisma = PrismaRepositorie.getInstance();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    return await this.validateIfIsAdmin(userId);
  }

  private async validateIfIsAdmin(userId: string) {
    const admin = await this.prisma.tenants.findFirst({
      where: {
        id: userId,
        isActive: true,
        isVerified: true,
      },
    });
    if (!admin) {
      throw new ForbiddenException({
        message: 'Precisa ser uma empresa verificada para exercer esta acção',
      });
    }
    return true;
  }
}
