import { Body, Controller, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateCompanieDTo } from './dto/create.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Companies')
@Controller('v1/companies')
export default class TennatsController {
  constructor(private readonly TenantsService: TenantsService) {}

  @Post('')
  @ApiOperation({
    summary: 'Criação de conta empresa na voluttis',
    description:
      'Preenche todos os dados conforme e crie sua conta em burocracia',
  })
  public async create(@Body() dto: CreateCompanieDTo) {
    return this.TenantsService.create(dto);
  }
}
