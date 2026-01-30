import { ITransactionRepositorie } from '../repositories/@types';
import { UpdatePaymentDTO } from '../dto/update.dto';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { ITransactionState } from '../observers/states/state.interface';
import { Paid } from '../observers/states/Paid/paid.state';
import { Fail } from '../observers/states/Fail/fail.state';
import { ApiKeyRepositorie } from '@/domains/keys/repositories/@types';
import { NotificationsService } from '@/domains/notifications/notification.service';

export class UpdatePayment {
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

  private nofiers: Record<'PAID' | 'FAILED', ITransactionState>;

  constructor(
    private readonly repo: ITransactionRepositorie,
    private readonly aikeyRepo: ApiKeyRepositorie,
    private readonly notification: NotificationsService,
  ) {
    this.nofiers = {
      PAID: new Paid(this.notification),
      FAILED: new Fail(this.notification),
    };
  }

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
    const apikey = await this.aikeyRepo.getKeyByTenantId(
      transaction.companieId,
    );
    if (!apikey) {
      throw new BadRequestException({
        message: 'Entidade não pode receber pagamentos',
      });
    }
    this.logger.debug('API_SIGN => ', data.sign);
    this.logger.debug('TRANSACTION_SIGN => ', transaction.signature);

    if (transaction.status == status) {
      throw new BadRequestException({
        message: 'Transação de status inválido',
      });
    }

    const notifier = this.nofiers[status] ?? new Fail(this.notification);
    await notifier.execute(transaction);
  }

  private mapPaypayStatus(paypayStatus: string): PaymentStatus {
    return this.statusMap[paypayStatus] ?? 'PENDING';
  }
}
