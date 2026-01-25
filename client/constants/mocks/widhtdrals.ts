import { IWithdrawal, PaymentStatus } from "@/types";

export const withdrawalsMock: IWithdrawal[] = [
  {
    id: "wd_001",
    walletId: "wlt_001",
    companieId: "cmp_001",
    amount: 10000,
    status: PaymentStatus.PAID,
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-10"),
    fileUrl: null,
    notes: "Saque via referência",
    approvedAt: new Date("2026-01-11"),
    revokedAt: null,
  },
  {
    id: "wd_002",
    walletId: "wlt_001",
    companieId: "cmp_001",
    amount: 5000,
    status: PaymentStatus.PENDING,
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "wd_003",
    walletId: "wlt_001",
    companieId: "cmp_001",
    amount: 2000,
    status: PaymentStatus.REJECTED,
    createdAt: new Date("2026-01-18"),
    updatedAt: new Date("2026-01-18"),
    notes: "Conta inválida",
  },
];
