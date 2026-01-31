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
    const percent = Math.round(constants.TAX * 100);

    return {
      taxType: 'PERCENT',
      taxa: percent + '%',
      currency: 'AOA',
      value: constants.TAX,
    };
  }
}
