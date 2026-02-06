import { Withdrawals } from '@prisma/client';
import { IWidthDrawsStatusTransaction } from '..';
import PrismaRepositorie from '@/infra/database/Prisma';
import { BadRequestException } from '@nestjs/common';
import { UpdateWidthdralDto } from '../../dto/update.dto';
import { NotificationsService } from '@/domains/notifications/notification.service';

export class Approved implements IWidthDrawsStatusTransaction {
  private readonly prisma = PrismaRepositorie.getInstance();

  constructor(private readonly notifier: NotificationsService) {}

  public async exeute(
    data: Withdrawals,
    updatedDto: UpdateWidthdralDto,
  ): Promise<void> {
    if (data.status !== 'PENDING') {
      throw new BadRequestException({
        message: 'Saque para ser aprovado precisa estar pendente',
      });
    }

    const saque = Number(data.amount);

    await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenants.findUnique({
        where: { id: data.companieId },
      });

      if (!tenant) {
        throw new BadRequestException({ message: 'Tenant não encontrado' });
      }

      const saldoDisponivel = Number(tenant.totalDisponible);
      const totalFaturado = Number(tenant.totalErned);
      if (saldoDisponivel < saque || totalFaturado < saque) {
        throw new BadRequestException({
          message: 'Saldo insuficiente para saque',
        });
      }

      await tx.tenants.update({
        where: { id: data.companieId },
        data: {
          totalDisponible: { decrement: saque },
        },
      });

      await tx.withdrawals.update({
        where: { id: data.id },
        data: {
          status: 'APPROVED',
          fileUrl: updatedDto.fileUrl,
          notes: updatedDto.notes,
          approvedAt: new Date(),
        },
      });
    });

    await this.notifier.update(
      {
        companieId: data.companieId,
        entitieId: data.id,
        message: `Saque aprovado ${Number(data.amount).toLocaleString('pt')},00 kz`,
        type: 'WITHDRAWALS',
      },
      data.id,
    );
  }
}
