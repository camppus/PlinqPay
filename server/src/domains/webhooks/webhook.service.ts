import { Injectable } from '@nestjs/common';
import PrismaWebhookRepositorie from './repositories/repos/PrismaWebhooksRepositorie';
import { CreateWebhookUsecase } from './useCase/createuseCase';
import { TenantsPrismaRepositorie } from '../tenants/repositories/repos/tenantsPrismaRepo';
import { CreateWebhookDto } from './dto/create.dto';
import { UpdateWebHookUseCase } from './useCase/updateUseCase';
import { GetWebHook } from './useCase/getUseCase';
import { DeteleWebHookUseCase } from './useCase/deleteUseCase';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly webhookRepo: PrismaWebhookRepositorie,
    private readonly tenantRepo: TenantsPrismaRepositorie,
  ) {}

  public async create(data: CreateWebhookDto, tenantId: string) {
    const createWebHookProcessor = new CreateWebhookUsecase(
      this.webhookRepo,
      this.tenantRepo,
    );
    return await createWebHookProcessor.execute(data, tenantId);
  }

  public async update(data: CreateWebhookDto, tenantId: string, id: string) {
    const updateWebHookProcessor = new UpdateWebHookUseCase(
      this.webhookRepo,
      this.tenantRepo,
    );
    return await updateWebHookProcessor.execute(data, tenantId, id);
  }

  public async getByTenantId(tenantId: string) {
    const getter = new GetWebHook(this.webhookRepo);
    return await getter.getByTenant(tenantId);
  }

  public async getAll(page: number) {
    const getter = new GetWebHook(this.webhookRepo);
    return await getter.getAlls(page, 20);
  }

  public async remove(tenantId: string, id: string) {
    const createWebHookProcessor = new DeteleWebHookUseCase(this.webhookRepo);
    return await createWebHookProcessor.execute(id, tenantId);
  }
}
