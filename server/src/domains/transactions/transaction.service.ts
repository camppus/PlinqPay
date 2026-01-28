import { Paymentprocessor } from '@/infra/Getaway';
import { PrismaAPiKeyRepositorie } from '../keys/repositories/repos/prismaApiKeysRepositorie';
import { CreateTransactionDTO } from './dto/create.dto';
import { CreatePaymentUseCase } from './useCases/createPayment';
import { PrismaTransactionRepositorie } from './repositories/repos/PrismaTransactionRepositorie';
import { ApiSecretKeys } from '@prisma/client';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetPaymentUseCase } from './useCases/getPayment';
import { UpdatePaymentDTO } from './dto/update.dto';
import { UpdatePayment } from './useCases/updatePayment';
import { NotificationsService } from '../notifications/notification.service';

@Injectable()
export default class TrasanctionService {
  constructor(
    private readonly apiKeyRepo: PrismaAPiKeyRepositorie,
    private readonly transactionRepo: PrismaTransactionRepositorie,
    private readonly notifier: NotificationsService,
  ) {}

  public async create(data: CreateTransactionDTO, publickApiKey: string) {
    const processor = new Paymentprocessor(data.method);
    const paymentUseCase = new CreatePaymentUseCase(
      this.transactionRepo,
      processor,
      this.notifier,
    );
    const apikey = (await this.apiKeyRepo.getByPublickKey(
      publickApiKey,
    )) as ApiSecretKeys;
    const { data: createPayment } = await paymentUseCase.pay(data, apikey);
    return {
      data: createPayment,
    };
  }

  public async getByTenant(page: number, tenantId: string) {
    const getter = new GetPaymentUseCase(this.transactionRepo);
    return await getter.getByTenant(page, 20, tenantId);
  }

  public async getAll(page: number) {
    const getter = new GetPaymentUseCase(this.transactionRepo);
    return await getter.getAll(page, 20);
  }

  public async getDetails(id: string, tenantId: string) {
    const getter = new GetPaymentUseCase(this.transactionRepo);
    const response = await getter.getById(id);
    if (response?.companieId != tenantId) {
      throw new ForbiddenException({
        message: 'Você não tem permisão para ver este conteudo',
      });
    }
    return response;
  }

  public async update(data: UpdatePaymentDTO) {
    const updater = new UpdatePayment(
      this.transactionRepo,
      this.apiKeyRepo,
      this.notifier,
    );
    const updated = await updater.execute(data);
  }
}
