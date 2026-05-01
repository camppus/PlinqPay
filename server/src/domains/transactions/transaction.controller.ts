import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  Req
} from '@nestjs/common';
import TrasanctionService from './transaction.service';
import { CreateTransactionDTO } from './dto/create.dto';
import IsApiKeyAbleToProcessPaymentGuard from '@/guards/apiKey.guard';
import { CurrentApiKey } from '@/decorators/apikey.decorator';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPositiveNumberPipe } from '@/pipes/isPositive.pipe';
import { CurrentUser } from '@/decorators/currentUser.decorator';
import IsAdminGuard from '@/guards/isAdmin.guard';
import IsActiveTenantGuard from '@/guards/isTenantVerified.guard';
import { UpdatePaymentDTO } from './dto/update.dto';
import type { Request } from 'express'

@ApiTags('Pagamentos')
@Controller('v1/transaction')
export class TransactionController {
  constructor(private readonly service: TrasanctionService) {}
  @Post()
  @ApiOperation({
    summary: 'Criar pagamento',
  })
  @ApiHeader({
    name: 'api-key',
  })
  @UseGuards(IsApiKeyAbleToProcessPaymentGuard)
  public async create(
    @Body() data: CreateTransactionDTO,
    @CurrentApiKey() apikey: string,
  ) {
    return await this.service.create(data, apikey);
  }

  @Get('/my')
  @UseGuards(IsActiveTenantGuard)
  @ApiOperation({
    summary: 'Lista de pagementos por conta',
  })
  public async getAllByTenantId(
    @Query('page', IsPositiveNumberPipe) page: number,
    @CurrentUser(ParseUUIDPipe) tenantId: string,
  ) {
    return await this.service.getByTenant(1, tenantId);
  }

  @Get()
  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Lista de pagementos',
  })
  public async getAll(@Query('page', IsPositiveNumberPipe) page: number) {
    return await this.service.getAll(page);
  }

  @Get(':id/details')
  @ApiOperation({
    summary: 'Detalhes do pagamento',
  })
  public async getDetails(
    @CurrentUser(ParseUUIDPipe) tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.service.getDetails(id, tenantId);
  }

  @Post('notify')
  @ApiOperation({
    summary: 'Callback para getaway interno',
  })
  @HttpCode(200)
  @Header('Content-Type', 'text/plain')
  async update(@Body() data: UpdatePaymentDTO , @Req() request : Request) {
    consol.log(request)
    await this.service.update(data);
    return {
      sucess : true
    }
  }
}
