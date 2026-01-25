import { NotificationType } from "@/types";

export type INotification = {
  id: string;
  companieId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
};

export const notificationsMock: INotification[] = [
  {
    id: "notif_001",
    companieId: "cmp_001",
    message: "Pagamento recebido com sucesso",
    type: NotificationType.PAYMENT,
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: "notif_002",
    companieId: "cmp_001",
    message: "Solicitação de saque aprovada",
    type: NotificationType.WITHDRAWALS,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "notif_003",
    companieId: "cmp_001",
    message: "Tentativa de login suspeita detectada",
    type: NotificationType.SECURITY,
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "notif_004",
    companieId: "cmp_001",
    message: "Seu KYC foi enviado e está em análise",
    type: NotificationType.OTHERS,
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];
