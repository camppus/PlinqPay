import PrismaRepositorie from '@/infra/database/Prisma';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export default class IsActiveTenantGuard implements CanActivate {
  private readonly prisma = PrismaRepositorie.getInstance();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    return await this.verify(userId);
  }

  private async verify(userId: string) {
    const user = await this.prisma.tenants.findFirst({
      where: {
        id: userId,
        isActive: true,
      },
    });
    if (!user) {
      throw new ForbiddenException({
        message: 'Precisa ser uma empresa verificada para exercer esta acção',
      });
    }
    return true;
  }
}
