import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateCompanieDTo } from './dto/create.dto';
import { ApiHideProperty, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateTenantDTO } from './dto/updtae.dto';
import { CurrentUser } from '@/decorators/currentUser.decorator';
import { IsPositiveNumberPipe } from '@/pipes/isPositive.pipe';
import IsAdminGuard from '@/guards/isAdmin.guard';
import IsActiveTenantGuard from '@/guards/isTenantVerified.guard';

@ApiTags('Empresas')
@Controller('v1/tenants')
export default class TennatsController {
  constructor(private readonly TenantsService: TenantsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criação de conta empresa',
  })
  public async create(@Body() dto: CreateCompanieDTo) {
    return this.TenantsService.create(dto);
  }

  @Patch()
  @UseGuards(IsActiveTenantGuard)
  @ApiOperation({
    summary: 'Update de conta empresa',
  })
  public async update(
    @Body() dto: UpdateTenantDTO,
    @CurrentUser(ParseUUIDPipe) tenantId: string,
  ) {
    return this.TenantsService.update(dto, tenantId);
  }

  @Get()
  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Listagem de empresas',
  })
  public async list(@Query('cursor', IsPositiveNumberPipe) cursor: number = 1) {
    return this.TenantsService.getAll(cursor);
  }

  @UseGuards(IsAdminGuard)
  @Get(':id/details')
  @ApiOperation({
    summary: 'Detalhes de uma empresa',
  })
  public async getByUnique(@Param('id', ParseUUIDPipe) id: string) {
    return this.TenantsService.getByUnique(id);
  }

  @UseGuards(IsActiveTenantGuard)
  @Get('/me')
  @ApiOperation({
    summary: 'Detalhes da minha empresa',
  })
  public async getMyTenant(@CurrentUser(ParseUUIDPipe) id: string) {
    return this.TenantsService.getByUnique(id);
  }

  @Put(':id')
  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Toggle de empresa',
  })
  public async toogle(@Param('id', ParseUUIDPipe) id: string) {
    return this.TenantsService.toogle(id);
  }
}
