import {
  PaymentStatus,
  PaymentMethod,
  TaxType,
  ITransaction,
  ITransactionClientInfo,
  ITransactionItem,
} from "@/types";

export const transactionsMock: ITransaction[] = [
  {
    id: "trx_001",
    companieId: "cmp_001",
    externId: "order_1001",
    getawayIdentifier: "PLIQPAG",
    status: PaymentStatus.PAID,

    amount: 10000,
    subtotal: 9500,
    tax: 500,
    total: 10000,

    taxType: TaxType.PERCENT,
    method: PaymentMethod.REFERENCE,
    currency: "AOA",

    signature: "sig_paid_001",
    entity: "12345",
    reference: "987654321",
    callbackUrl: "https://merchant.com/webhook",
    paidAt: new Date(),

    createdAt: new Date(),
    updatedAt: new Date(),

    client: {
      id: "cli_001",
      transactionId: "trx_001",
      name: "João Manuel",
      email: "joao@email.com",
      phone: "+244923456789",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    items: [
      {
        id: "item_001",
        transactionId: "trx_001",
        title: "Plano Premium",
        price: 9500,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },

  {
    id: "trx_002",
    companieId: "cmp_001",
    externId: "order_1002",
    getawayIdentifier: "PLIQPAG",
    status: PaymentStatus.PENDING,

    amount: 25000,
    subtotal: 24000,
    tax: 1000,
    total: 25000,

    taxType: TaxType.PERCENT,
    method: PaymentMethod.REFERENCE,
    currency: "AOA",

    signature: "sig_pending_002",
    entity: "12345",
    reference: "123456789",
    callbackUrl: "https://merchant.com/webhook",

    createdAt: new Date(),
    updatedAt: new Date(),

    client: {
      id: "cli_002",
      transactionId: "trx_002",
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "+244934567890",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    items: [
      {
        id: "item_002",
        transactionId: "trx_002",
        title: "Curso React Avançado",
        price: 12000,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "item_003",
        transactionId: "trx_002",
        title: "Certificado Digital",
        price: 12000,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },

  {
    id: "trx_003",
    companieId: "cmp_002",
    externId: "order_1003",
    getawayIdentifier: "PLIQPAG",
    status: PaymentStatus.FAILED,

    amount: 15000,
    subtotal: 15000,
    tax: 0,
    total: 15000,

    taxType: TaxType.NONE,
    method: PaymentMethod.REFERENCE,
    currency: "AOA",

    signature: "sig_failed_003",
    callbackUrl: "https://merchant.com/webhook",
    failureReason: "Saldo insuficiente",

    createdAt: new Date(),
    updatedAt: new Date(),

    client: {
      id: "cli_003",
      transactionId: "trx_003",
      name: "Carlos Mendes",
      email: "carlos@email.com",
      phone: "+244945678901",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    items: [
      {
        id: "item_004",
        transactionId: "trx_003",
        title: "Assinatura Mensal",
        price: 15000,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },

  {
    id: "trx_004",
    companieId: "cmp_003",
    externId: "order_1004",
    getawayIdentifier: "PLIQPAG",
    status: PaymentStatus.APPROVED,

    amount: 50000,
    subtotal: 47000,
    tax: 3000,
    total: 50000,

    taxType: TaxType.IVA,
    method: PaymentMethod.REFERENCE,
    currency: "AOA",

    signature: "sig_approved_004",
    entity: "67890",
    reference: "456789123",
    callbackUrl: "https://merchant.com/webhook",

    createdAt: new Date(),
    updatedAt: new Date(),

    client: {
      id: "cli_004",
      transactionId: "trx_004",
      name: "Ana Costa",
      email: "ana@email.com",
      phone: "+244956789012",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    items: [
      {
        id: "item_005",
        transactionId: "trx_004",
        title: "Pagamento Empresarial",
        price: 47000,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },

  {
    id: "trx_005",
    companieId: "cmp_004",
    externId: "order_1005",
    getawayIdentifier: "PLIQPAG",
    status: PaymentStatus.REJECTED,

    amount: 8000,
    subtotal: 8000,
    tax: 0,
    total: 8000,

    taxType: TaxType.NONE,
    method: PaymentMethod.REFERENCE,
    currency: "AOA",

    signature: "sig_rejected_005",
    callbackUrl: "https://merchant.com/webhook",
    failureReason: "Referência expirada",

    createdAt: new Date(),
    updatedAt: new Date(),

    client: {
      id: "cli_005",
      transactionId: "trx_005",
      name: "Pedro Lopes",
      email: "pedro@email.com",
      phone: "+244967890123",
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    items: [
      {
        id: "item_006",
        transactionId: "trx_005",
        title: "Recarga Digital",
        price: 8000,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
];
