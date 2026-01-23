import { NotificationType } from '@prisma/client';

export class NotificationPayLoad {
  entitieId: string;
  companieId: string;
  message: string;
  type: NotificationType;
}
