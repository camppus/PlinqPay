import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WalletService } from './wallets.service';
import { CreateWalletDTO } from './dto/create.dto';
import { Wallet } from '@prisma/client';
import IsAdminGuard from '@/guards/isAdmin.guard';
import IsTenantVerifiedGuard from '@/guards/isVerifiedtenant.guard';
import { CurrentUser } from '@/decorators/currentUser.decorator';

@ApiTags('Carteira')
@Controller('v1/wallets')
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova carteira' })
  @UseGuards(IsTenantVerifiedGuard)
  async create(
    @Body() data: CreateWalletDTO,
    @CurrentUser() tenantId: string,
  ): Promise<Wallet> {
    return this.service.create(data, tenantId);
  }

  @Get()
  @UseGuards(IsAdminGuard)
  @ApiOperation({ summary: 'Listar todas as carteiras com paginação' })
  async getAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.getAll(+page, +limit).then((r) => r.data);
  }

  @Get(':unique')
  @UseGuards(IsAdminGuard)
  @ApiOperation({ summary: 'Obter uma carteira pelo ID ou companieId' })
  async getByUnique(@Param('unique') unique: string): Promise<Wallet | null> {
    return this.service.getByUnique(unique);
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar dados da carteira de um tenant' })
  @UseGuards(IsTenantVerifiedGuard)
  async update(
    @Body() data: CreateWalletDTO,
    @CurrentUser() tenantId: string,
  ): Promise<Wallet> {
    return this.service.update(data, tenantId);
  }

  @Patch('toggle/:walletId')
  @UseGuards(IsAdminGuard)
  @ApiOperation({ summary: 'Ativar ou desativar carteira' })
  async toggle(
    @Param('walletId') walletId: string,
  ): Promise<{ updated: boolean }> {
    return this.service.toggle(walletId);
  }
}
