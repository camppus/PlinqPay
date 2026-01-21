import { Module } from '@nestjs/common';
import ApiKeyService from './keys.service';
import { PrismaAPiKeyRepositorie } from './repositories/repos/prismaApiKeysRepositorie';
import APiKeyController from './key.controller';

@Module({
  providers: [ApiKeyService, PrismaAPiKeyRepositorie],
  exports: [ApiKeyService, PrismaAPiKeyRepositorie],
  controllers: [APiKeyController],
})
export class APikeyModule {}
