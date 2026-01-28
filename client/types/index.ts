export enum Role {
  COMPANIE = "COMPANIE",
  SUPERCOMPANIE = "SUPERCOMPANIE",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum PaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  FAILED = "FAILED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum PaymentMethod {
  REFERENCE = "REFERENCE",
}

export enum WebhooksScope {
  PAYMENTS = "PAYMENTS",
  WITHDRAWALS = "WITHDRAWALS",
}

export enum WebHooksEvents {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  CREATED = "CREATED",
  REJECTED = "REJECTED",
}

export enum NotificationType {
  PAYMENT = "PAYMENT",
  WITHDRAWALS = "WITHDRAWALS",
  SECURITY = "SECURITY",
  OTHERS = "OTHERS",
}

export enum WebHooksMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
}

export enum TaxType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
  IVA = "IVA",
  NONE = "NONE",
}

export enum WebhookDeliveryStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface ITenant {
  id: string;
  cursor: number;
  title: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  totalErned: number;
  totalDisponible: number;
  totalErnedWithTax: number;

  keys?: IApiSecretKey[];
  kycValidation?: IKycValidation | null;
  notifications?: INotification[];
  transactions?: ITransaction[];
  wallet?: IWallet | null;
  withdrawals?: IWithdrawal[];
}

export interface IKycValidation {
  id: string;
  companieId: string;
  documentFrontUrl: string;
  documentBackUrl: string;
  bi: string;
  status: VerificationStatus;
  notes?: string | null;
  verified: boolean;
  verifiedAt?: Date | null;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;

  companie?: ITenant;
}

export interface IApiSecretKey {
  id: string;
  title: string;
  companieId: string;
  publicKey: string;
  secretKey: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  companie?: ITenant;
}

export interface ITransaction {
  id: string;
  companieId: string;
  externId: string;
  getawayIdentifier: string;
  status: PaymentStatus;

  amount: number;
  subtotal: number;
  tax: number;
  total: number;

  taxType: TaxType;
  method: PaymentMethod;
  currency: string;

  signature: string;
  entity?: string | null;
  reference?: string | null;
  callbackUrl: string;

  paidAt?: Date | null;
  failureReason?: string | null;

  createdAt: Date;
  updatedAt: Date;

  companie?: ITenant;
  client?: ITransactionClientInfo | null;
  items: ITransactionItem[];
  webhooksDelivery?: IWebhookDelivery[];
}

export interface ITransactionItem {
  id: string;
  transactionId: string;
  title: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  transaction?: ITransaction;
}

export interface ITransactionClientInfo {
  id: string;
  transactionId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;

  transaction?: ITransaction;
}

export interface IWebhookDelivery {
  id: string;
  transactionId: string;
  event: WebHooksEvents;
  url: string;
  payload: any;
  status: WebhookDeliveryStatus;
  attempts: number;
  lastError?: string | null;
  deliveredAt?: Date | null;
  nextRetryAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  transaction?: ITransaction;
}

export interface IWallet {
  id: string;
  companieId: string;
  walletHolder: string;
  iban: string;
  bank: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  companie?: ITenant;
  withdrawals?: IWithdrawal[];
}

export interface IWithdrawal {
  id: string;
  walletId: string;
  companieId: string;
  amount: number;
  status: PaymentStatus;
  fileUrl?: string | null;
  notes?: string | null;
  approvedAt?: Date | null;
  revokedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  companie?: ITenant;
  wallet?: IWallet;
}

export interface INotification {
  id: string;
  entitieId: string;
  companieId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;

  companie?: ITenant;
}

export interface Istats {
  title: string;
  subtitle: string;
  description: string;
  amount: number;
  isCoin: boolean;
}
