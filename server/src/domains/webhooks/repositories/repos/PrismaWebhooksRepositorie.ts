import PrismaRepositorie from '@/infra/database/Prisma';
import { IWebhookRepositorie } from '../@type';
import { Prisma, WebHooks } from '@prisma/client';
import { IPAginationGet } from '@/types';
import { CreateWebhookDto } from '../../dto/create.dto';
import { Injectable } from '@nestjs/common';


@Injectable()
export default class PrismaWebhookRepositorie implements IWebhookRepositorie {
  private readonly prisma = PrismaRepositorie.getInstance();

  public async create(
    data: CreateWebhookDto,
    tenantId: string,
  ): Promise<WebHooks> {
    return this.prisma.webHooks.create({
      data: {
        ...data,
        companieId: tenantId,
      },
    });
  }
  public async deleteWebHook(webhookId: string): Promise<WebHooks> {
    return this.prisma.webHooks.delete({
      where: {
        id: webhookId,
      },
    });
  }
  public async getAllWebhooks(
    page: number,
    limit: number,
  ): Promise<IPAginationGet<WebHooks[]>> {
    const offset = (page - 1) * limit;
    const myWebHooks = await this.prisma.webHooks.findMany({
      take: limit,
      skip: offset,
    });

    return {
      data: myWebHooks as any,
      pagination: {
        cursor: page,
        limit,
      },
      total: myWebHooks.length,
    };
  }
  public async getMyWebhooks(
    tenantId: string,
  ): Promise<IPAginationGet<WebHooks[]>> {
    const myWebHooks = await this.prisma.webHooks.findMany({
      where: {
        companieId: tenantId,
      },
    });

    return {
      data: myWebHooks as any,
      pagination: {
        cursor: 1,
        limit: myWebHooks.length,
      },
      total: myWebHooks.length,
    };
  }
  public async update(
    data: CreateWebhookDto,
    tenantId: string,
    webHookId: string,
  ): Promise<{
    updated: boolean;
  }> {
    const where: Prisma.WebHooksWhereInput = {
      id: webHookId,
      companieId: tenantId,
    };
    await this.prisma.webHooks.updateMany({
      data: {
        ...data,
      },

      where,
    });
    return {
      updated: true,
    };
  }
  public async getById(id: string): Promise<WebHooks | null> {
    return await this.prisma.webHooks.findFirst({
      where: {
        id,
      },
    });
  }
}
