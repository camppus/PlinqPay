import { Notification } from '@prisma/client';
import { NotificationPayLoad } from '../dto/payload.dto';
import { IPAginationGet } from '@/types';

export interface INotificationRepositorie {
  create(payload: NotificationPayLoad): Promise<Notification>;
  update(payload: NotificationPayLoad, id: string): Promise<Notification>;
  get(
    page: number,
    limit: number,
    tenantId: string,
  ): Promise<IPAginationGet<Notification>>;
  read(tenantId: string): Promise<{ updated: boolean }>;
  getUnread(tenantId: string): Promise<any>;
}
