import { Global, Module } from '@nestjs/common';
import { NotificationsController } from './notification.controller';
import { NotificationsService } from './notification.service';
import { PrismaNotificationRepository } from './repos/repos/PrismaNofiticationRepo';

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaNotificationRepository],
  exports: [NotificationsService],
})
export class NotificationsModule {}
