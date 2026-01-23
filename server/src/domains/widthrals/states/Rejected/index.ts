import { Withdrawals } from '@prisma/client';
import { IWidthDrawsStatusTransaction } from '..';
import PrismaRepositorie from '@/infra/database/Prisma';
import { BadRequestException } from '@nestjs/common';
import { UpdateWidthdralDto } from '../../dto/update.dto';

export class Rejected implements IWidthDrawsStatusTransaction {
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
    await this.prisma.withdrawals.update({
      where: {
        id: data.id,
      },
      data: {
        status: 'REJECTED',
        fileUrl: updatedDto.fileUrl,
        notes: updatedDto.notes,
        revokedAt: new Date(),
      },
    });
    return;
  }
}
