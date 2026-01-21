import PrismaRepositorie from '@/infra/database/Prisma';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export default class IsActiveTenantGuard implements CanActivate {
  private readonly prisma = PrismaRepositorie.getInstance();

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    return this.validateIfIsAdmin(userId);
  }

  private async validateIfIsAdmin(userId: string) {
    const admin = await this.prisma.tenants.findFirst({
      where: {
        id: userId,
        isActive: true,
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
