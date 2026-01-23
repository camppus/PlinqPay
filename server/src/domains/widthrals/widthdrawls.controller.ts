import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WidthdrawlService } from './widthdrawls.service';
import { CreateWidthrawlDto } from './dto/create.dto';
import { UpdateWidthdralDto } from './dto/update.dto';
import { CurrentUser } from '@/decorators/currentUser.decorator';
import IsActiveTenantGuard from '@/guards/isTenantVerified.guard';
import IsAdminGuard from '@/guards/isAdmin.guard';

@ApiTags('Saque')
@Controller('withdrawals')
@UseGuards(IsActiveTenantGuard)
export class WithdrawalsController {
  constructor(private readonly withdrawlService: WidthdrawlService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um pedido de saque',
    description: 'Cria um novo saque para a empresa autenticada',
  })
  async create(
    @Body() data: CreateWidthrawlDto,
    @CurrentUser() tenantId: string,
  ) {
    return await this.withdrawlService.create(data, tenantId);
  }

  @Get()
  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Listar saques',
    description: 'Lista os saques com paginação',
  })
  async get(@Query('page') page = 1) {
    return await this.withdrawlService.get(Number(page));
  }

  @Put()
  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Atualizar status do saque',
    description: 'Aprova ou rejeita um saque',
  })
  async update(@Body() data: UpdateWidthdralDto) {
    return await this.withdrawlService.updater(data);
  }
}
