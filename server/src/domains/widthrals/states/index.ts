import { Withdrawals } from '@prisma/client';
import { UpdateWidthdralDto } from '../dto/update.dto';

export interface IWidthDrawsStatusTransaction {
  exeute(data: Withdrawals, updatedDto: UpdateWidthdralDto): Promise<void>;
}
