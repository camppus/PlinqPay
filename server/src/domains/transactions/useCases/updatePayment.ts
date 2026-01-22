import { ITransactionRepositorie } from '../repositories/@types';
import { UpdatePaymentDTO } from '../dto/update.dto';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { ITransactionState } from '../observers/states/state.interface';
import { Paid } from '../observers/states/Paid/paid.state';
import { Fail } from '../observers/states/Fail/fail.state';
import Assignature from '@/lib/shared/Assignature';
import { ApiKeyRepositorie } from '@/domains/keys/repositories/@types';

export class UpdatePayment {
  private readonly asign = new Assignature();
  private readonly logger = new Logger('UpdatePayment Logger ->>');
  private readonly statusMap: Record<string, PaymentStatus> = {
    TRADE_SUCCESS: 'PAID',
    TRADE_FINISHED: 'PAID',
    REFUND_SUCCESS: 'PAID',
    TRANSFER_SUCCESS: 'PAID',
    TRADE_CLOSED: 'FAILED',
    REFUND_FAIL: 'FAILED',
    TRANSFER_FAIL: 'FAILED',
  };

  private nofiers: Record<'PAID' | 'FAILED', ITransactionState> = {
    PAID: new Paid(),
    FAILED: new Fail(),
  };

  constructor(
    private readonly repo: ITransactionRepositorie,
    private readonly aikeyRepo: ApiKeyRepositorie,
  ) {}

  public async execute(data: UpdatePaymentDTO) {
    const status = this.mapPaypayStatus(data.status);

    if (status == 'PENDING') {
      throw new BadRequestException({
        message: 'Pagamento pendente não sofre mudanças manuais',
      });
    }

    const transaction = await this.repo.getDetails(data.out_trade_no);
    this.logger.debug(transaction);
    if (!transaction || !transaction?.client || !transaction.items) {
      throw new NotFoundException({
        message: 'Transação nẽo encontrada',
      });
    }

    const assignedText = data.out_trade_no;
    const apikey = await this.aikeyRepo.getKeyByTenantId(
      transaction.companieId,
    );
    if (!apikey) {
      throw new BadRequestException({
        message: 'Entidade não pode receber pagamentos',
      });
    }

    if (
      !this.asign.verifySignature(
        {
          amount: Number(transaction.amount.toFixed(2)),
          callbackUrl: transaction.callbackUrl,
          client: transaction.client,
          externalId: transaction.externId,
          items: transaction.items.map((item) => {
            return {
              ...item,
              price: Number(item.price.toFixed(2)),
            };
          }),
          method: transaction.method,
          sign: assignedText,
        },
        apikey?.secretKey,
      )
    ) {
      throw new BadRequestException({
        message: 'Assinatura inválida',
      });
    }

    if (transaction.status == status) {
      throw new BadRequestException({
        message: 'Transação de status inválido',
      });
    }

    const notifier = this.nofiers[status] ?? new Fail();
    await notifier.execute(transaction);
  }

  private mapPaypayStatus(paypayStatus: string): PaymentStatus {
    return this.statusMap[paypayStatus] ?? 'PENDING';
  }
}
