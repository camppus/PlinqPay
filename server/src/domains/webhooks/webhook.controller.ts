import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhooksService } from './webhook.service';
import { CreateWebhookDto } from './dto/create.dto';
import { CurrentUser } from '@/decorators/currentUser.decorator';
import IsAdminGuard from '@/guards/isAdmin.guard';
import IsActiveTenantGuard from '@/guards/isTenantVerified.guard';
import { IsPositiveNumberPipe } from '@/pipes/isPositive.pipe';

@Controller('v1/webhooks')
@ApiTags('Webhooks')
@UseGuards(IsActiveTenantGuard)
export class WebHooksController {
  constructor(private readonly service: WebhooksService) {}

  @Post()
  @ApiOperation({
    summary: 'Criação de webook',
  })
  public async create(
    @Body() data: CreateWebhookDto,
    @CurrentUser(ParseUUIDPipe) tenantId: string,
  ) {
    return await this.service.create(data, tenantId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update de webook',
  })
  public async update(
    @Body() data: CreateWebhookDto,
    @CurrentUser(ParseUUIDPipe) tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.service.update(data, tenantId, id);
  }

  @Get()
  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Listagem de todos',
  })
  public async getAll(@Query('page', IsPositiveNumberPipe) page: number) {
    return await this.service.getAll(page);
  }
  @Get(':id/my')
  @ApiOperation({
    summary: 'Listagem por perfil',
  })
  public async getMy(@CurrentUser(ParseUUIDPipe) tenantId: string) {
    return await this.service.getByTenantId(tenantId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remoção',
  })
  public async delete(
    @CurrentUser(ParseUUIDPipe) tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.service.remove(tenantId, id);
  }
}
