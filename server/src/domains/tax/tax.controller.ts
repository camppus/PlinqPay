import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import constants from '@/constants';

@Controller('v1/tax')
@ApiTags('Taxa')
export class TaxController {
  @ApiOperation({
    summary: 'Consultar a taxa',
  })
  @Get()
  public getConfigs() {
    return {
      taxType: 'PERCENT',
      value: constants.TAX * 100 + '%',
      currency: 'AOA',
    };
  }
}
