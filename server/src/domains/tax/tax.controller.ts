import { Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import constants from '@/constants';

@Controller('v1/tax')
@ApiTags('Taxa')
export class TaxController {
  @ApiOperation({
    summary: 'Consultar a taxa',
  })
  public getConfigs() {
    return {
      tax: constants.TAX,
    };
  }
}
