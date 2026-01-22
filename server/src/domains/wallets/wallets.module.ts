import { Module } from "@nestjs/common";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallets.service";
import { PrismaWalletRepositorie } from "./repositories/repos/PrismaWalletRepositorie";


@Module({
  controllers: [WalletController],
  providers: [WalletService, PrismaWalletRepositorie],
  exports: [WalletService, PrismaWalletRepositorie],
})
export class WalletModule {}