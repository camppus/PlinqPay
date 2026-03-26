import { Paymentprocessor } from '@/infra/Getaway';
import { PrismaAPiKeyRepositorie } from '../keys/repositories/repos/prismaApiKeysRepositorie';
import { CreateTransactionDTO } from './dto/create.dto';
import { CreatePaymentUseCase } from './useCases/createPayment';
import { PrismaTransactionRepositorie } from './repositories/repos/PrismaTransactionRepositorie';
import { ApiSecretKeys } from '@prisma/client';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetPaymentUseCase } from './useCases/getPayment';
import { UpdatePaymentDTO } from './dto/update.dto';
import { UpdatePayment } from './useCases/updatePayment';
import { NotificationsService } from '../notifications/notification.service';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export default class TrasanctionService {
  constructor(
    private readonly apiKeyRepo: PrismaAPiKeyRepositorie,
    private readonly transactionRepo: PrismaTransactionRepositorie,
    private readonly notifier: NotificationsService,
    private readonly tenant: TenantsService,
  ) {}

  public async create(data: CreateTransactionDTO, publickApiKey: string) {
    return null;
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
    const tenant = await this.tenant.getByUnique(tenantId);

    if (!tenant) {
      throw new NotFoundException({
        message: 'usuário nãao enontrado',
      });
    }
    const response = await getter.getById(id);
    const isAdmin = tenant?.data?.role === 'SUPERCOMPANIE';
    const isOwner = tenantId === response?.companieId;
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'Apenas o admin e o proprietário podem ver detalhes do pagamento',
      );
    }
    return response;
  }

  public async update(data: UpdatePaymentDTO) {
    const updater = new UpdatePayment(
      this.transactionRepo,
      this.apiKeyRepo,
      this.notifier,
    );
    try {
      await updater.execute(data);
    } catch (error) {
      console.log(error);
    }
  }
}
