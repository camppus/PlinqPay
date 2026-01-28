import { Controller, Get, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notification.service';
import { CurrentUser } from '@/decorators/currentUser.decorator';
import { IsPositiveNumberPipe } from '@/pipes/isPositive.pipe';

@ApiTags('Notificações')
@Controller('v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar notificações',
    description: 'Ordenadas por não lidas e data',
  })
  async get(
    @Query('page', IsPositiveNumberPipe) page = 1,
    @CurrentUser() tenantId: string,
  ) {
    return await this.notificationsService.get(
      Number(page),
      Number(50),
      tenantId,
    );
  }

  @Get('unread')
  @ApiOperation({
    summary: 'Total não lida',
  })
  async unread(@CurrentUser() tenantId: string) {
    return await this.notificationsService.unread(tenantId);
  }

  @Put('read')
  @ApiOperation({
    summary: 'Marcar notificações como lidas',
    description: 'Marca todas como lidas para a empresa',
  })
  async read(@CurrentUser() tenantId: string) {
    return await this.notificationsService.read(tenantId);
  }
}
