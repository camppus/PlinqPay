import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
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
@Controller('v1/withdrawals')
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

  @Get('/my')
  @ApiOperation({
    summary: 'Listar saques por usuário',
  })
  async getByTenant(
    @Query('page', ParseIntPipe) page = 1,
    @CurrentUser() id: string,
  ) {
    return await this.withdrawlService.getByTenant(Number(page), id);
  }

  @Get()
  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Listar saques',
    description: 'Lista os saques com paginação',
  })
  async get(@Query('page', ParseIntPipe) page = 1) {
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
