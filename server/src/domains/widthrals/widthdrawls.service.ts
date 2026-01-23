
import { Injectable } from '@nestjs/common';
import { CreateWidthrawlDto } from './dto/create.dto';
import { CreateWidthDrawUseCase } from './useCase/createUseCase';
import { GetWidthdrawlUsecase } from './useCase/getUseCase';
import { UpdateWidthdralDto } from './dto/update.dto';
import { UpdateWidthDrawUseCase } from './useCase/updateUseCase';
import { PrismaWalletRepositorie } from '../wallets/repositories/repos/PrismaWalletRepositorie';
import { PrismaWidthDrawlRepo } from './repositories/repos/PrismaWidthDrawlRepositorie';
import { TenantsPrismaRepositorie } from '../tenants/repositories/repos/tenantsPrismaRepo';

@Injectable()
export class WidthdrawlService {
  constructor(
    private readonly tenantRepo: TenantsPrismaRepositorie,
    private readonly walletRepo: PrismaWalletRepositorie,
    private readonly widthrawlRepo: PrismaWidthDrawlRepo,
  ) {}

  public async create(data: CreateWidthrawlDto, tetantId: string) {
    const handler = new CreateWidthDrawUseCase(
      this.tenantRepo,
      this.walletRepo,
      this.widthrawlRepo,
    );
    return await handler.exute(data, tetantId);
  }

  public async get(page: number) {
    const handler = new GetWidthdrawlUsecase(this.widthrawlRepo);
    return await handler.exute(page, 20);
  }

  public async updater(data: UpdateWidthdralDto) {
    const handler = new UpdateWidthDrawUseCase(
      this.tenantRepo,
      this.walletRepo,
      this.widthrawlRepo,
    );
    return await handler.exute(data);
  }
}
