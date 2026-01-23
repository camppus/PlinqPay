import { Injectable } from '@nestjs/common';
import { NotificationPayLoad } from './dto/payload.dto';
import { PrismaNotificationRepository } from './repos/repos/PrismaNofiticationRepo';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepo: PrismaNotificationRepository,
  ) {}

  // CREATE
  async create(payload: NotificationPayLoad) {
    return await this.notificationRepo.create(payload);
  }

  // UPDATE
  async update(payload: NotificationPayLoad , id : string) {
    return await this.notificationRepo.update(payload, id);
  }

  // GET
  async get(page: number, limit = 20, tenantId: string) {
    return await this.notificationRepo.get(page, limit, tenantId);
  }

  // READ
  async read(tenantId: string) {
    return await this.notificationRepo.read(tenantId);
  }
  async unread(tenantId: string) {
    const data = await this.notificationRepo.getUnread(tenantId);

    return {
      data,
    };
  }
}
