import { Transaction } from "@prisma/client";


export interface ITransactionState {
  execute(data : Transaction): Promise<void>
}