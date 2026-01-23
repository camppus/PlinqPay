import { Withdrawals } from '@prisma/client';
import { IWidthDrawsStatusTransaction } from '..';
import PrismaRepositorie from '@/infra/database/Prisma';
import { BadRequestException } from '@nestjs/common';
import { UpdateWidthdralDto } from '../../dto/update.dto';

export class Approved implements IWidthDrawsStatusTransaction {
  private readonly prisma = PrismaRepositorie.getInstance();

  public async exeute(
    data: Withdrawals,
    updatedDto: UpdateWidthdralDto,
  ): Promise<void> {
    if (data.status != 'PENDING') {
      throw new BadRequestException({
        message: 'Saque para ser aprovado precisa estar pednente',
      });
    }

    const saldo = Math.round(Number(data.amount) * 100);
    await this.takeMoneyFromTenant(data.companieId, saldo);
    await this.prisma.withdrawals.update({
      where: {
        id: data.id,
      },
      data: {
        status: 'APPROVED',
        fileUrl: updatedDto.fileUrl,
        notes: updatedDto.notes,
        approvedAt: new Date(),
      },
    });
    return;
  }

  private async takeMoneyFromTenant(tetantId: string, amount: number) {
    await this.prisma.tenants.update({
      data: {
        totalDisponible: {
          decrement: amount,
        },
      },
      where: {
        id: tetantId,
      },
    });
  }
}
