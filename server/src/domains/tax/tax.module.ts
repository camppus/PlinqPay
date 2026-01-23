import { Global, Module } from '@nestjs/common';
import { TaxController } from './tax.controller';

@Global()
@Module({
  controllers: [TaxController],
})
export class TaxModule {}
