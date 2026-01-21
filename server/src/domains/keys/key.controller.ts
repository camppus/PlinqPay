import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import ApiKeyService from './keys.service';
import { CurrentUser } from '@/decorators/currentUser.decorator';
import { IsPositiveNumberPipe } from '@/pipes/isPositive.pipe';
import IsAdminGuard from '@/guards/isAdmin.guard';
import IsActiveTenantGuard from '@/guards/isTenantVerified.guard';
import IsTenantVerifiedGuard from '@/guards/isVerifiedtenant.guard';

@Controller('v1/apikeys')
@ApiTags('APikey')
export default class APiKeyController {
  constructor(private readonly service: ApiKeyService) {}

  @ApiOperation({
    summary: 'Criação de api-key',
    description: 'Apenas para usuários logados',
  })
  @UseGuards(IsTenantVerifiedGuard)
  @Post()
  public async create(@CurrentUser(ParseUUIDPipe) tenantId: string) {
    return await this.service.create(tenantId);
  }

  @ApiOperation({
    summary: 'toogle de api-key',
    description: 'Apenas para admin',
  })
  @Patch(':apikeyId')
  @UseGuards(IsAdminGuard)
  public async toogle(@Param('apikeyId', ParseUUIDPipe) apikeyId: string) {
    return await this.service.toogle(apikeyId);
  }

  @ApiOperation({
    summary: 'Listagem de api-key conforme o tipo de usuário',
    description: 'Apenas para usuários logados',
  })
  @UseGuards(IsTenantVerifiedGuard)
  @Get()
  public async get(
    @Query('page', IsPositiveNumberPipe) page: number,
    @CurrentUser(ParseUUIDPipe) tenantId: string,
  ) {
    return await this.service.get(page, 20, tenantId);
  }
}
