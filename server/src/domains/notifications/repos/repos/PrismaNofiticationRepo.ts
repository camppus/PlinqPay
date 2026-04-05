import PrismaRepositorie from '@/infra/database/Prisma';
import { Notification } from '@prisma/client';
import { INotificationRepositorie } from '../@types';
import { NotificationPayLoad } from '../../dto/payload.dto';
import { IPAginationGet } from '@/types';

export class PrismaNotificationRepository implements INotificationRepositorie {
  private readonly prisma = PrismaRepositorie.getInstance();
  async create(payload: NotificationPayLoad): Promise<Notification> {
    return await this.prisma.notification.create({
      data: {
        entitieId: payload.entitieId,
        companieId: payload.companieId,
        message: payload.message,
        type: payload.type,
        isRead: false,
      },
    });
  }
  async update(
    payload: NotificationPayLoad,
    id: string,
  ): Promise<Notification> {
    try {
      const data = await this.prisma.notification.update({
        where: {
          entitieId: id,
        },
        data: {
          message: payload.message,
          type: payload.type,
          isRead: false,
        },
      });
      return data;
    } catch (error) {
      return error as any;
    }
  }
  async get(
    page: number,
    limit: number,
    tenantId: string,
  ): Promise<IPAginationGet<Notification>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        skip,
        take: limit,
        orderBy: [
          { isRead: 'asc' },
          { createdAt: 'desc' },
          { updatedAt: 'desc' },
        ],
        where: {
          companieId: tenantId,
        },
      }),
      this.prisma.notification.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data,
      total,
      pagination: {
        page,
        limit,
        lastPage: totalPages,
      },
    };
  }
  async read(tenantId: string): Promise<{ updated: boolean }> {
    await this.prisma.notification.updateMany({
      where: {
        isRead: false,
        companieId: tenantId,
      },
      data: {
        isRead: true,
      },
    });

    return { updated: true };
  }
  async getUnread(tenantId: string): Promise<any> {
    const [lastSell , unread] = await Promise.all(
      [
        this.prisma.transaction.findFirst({
          where: {
            companieId: tenantId,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            client: true,
            items: true,
          },
        }),
        this.prisma.notification.count({
          where: {
            isRead: false,
            companieId: tenantId,
          },
        })
      ]
    )
    const { title, body } = this.buildSaleNotification(unread, lastSell);
    return {
      value : unread,
      title,
      body
    }
  }

private  buildSaleNotification(unread: number, sale: any) {
  if (!sale) {
    return {
      title: "🔔 Notificações",
      body: `Você tem ${unread} notificações não lidas`,
    };
  }

  const clientName = sale.client?.name ?? "Cliente";
  const total = Number(sale.total).toLocaleString("pt-AO") + " Kz";

  const items = sale.items ?? [];

  let productsText = "";

  if (items.length === 1) {
    productsText = items[0].title;
  } else if (items.length > 1) {
    productsText = `${items[0].title} +${items.length - 1} item(s)`;
  } else {
    productsText = "um produto";
  }

  const isPaid = sale.status === "PAID";

  const title = isPaid
    ? "💰 Venda concluída!"
    : "⏳ Pagamento pendente";

  const body = isPaid
    ? `${clientName} comprou ${productsText} por ${total}`
    : `${clientName} iniciou um pagamento de ${total}`;

  return { title, body };
}
  
}
