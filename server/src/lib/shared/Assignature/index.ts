import { CreateTransactionDTO } from '@/domains/transactions/dto/create.dto';
import crypto from 'node:crypto';

export default class Assignature {
  public genPublicKey(): string {
    return 'pk_' + crypto.randomBytes(48).toString('base64');
  }
  public genSecretKey(): string {
    return 'sk_' + crypto.randomBytes(48).toString('base64');
  }

  public assignature(secretKey: string, payload: CreateTransactionDTO): string {
    const payloadToVerify = {
      externalId: payload.externalId,
      amount: payload.amount,
      method: payload.method,
      callbackUrl: payload.callbackUrl,
    };

    const canonical = JSON.stringify(payloadToVerify);
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(canonical, 'utf8')
      .digest('base64');

    return signature;
  }

  public verifySignature(
    payload: CreateTransactionDTO & { sign: string },
    secretKey: string,
  ): boolean {
    const { sign } = payload;

    const payloadToVerify = {
      externalId: payload.externalId,
      amount: payload.amount,
      method: payload.method,
      callbackUrl: payload.callbackUrl,
    };
    const canonical = this.buildCanonicalString(payloadToVerify);
    const expectedSign = crypto
      .createHmac('sha256', secretKey)
      .update(canonical, 'utf8')
      .digest('base64');

    return crypto.timingSafeEqual(Buffer.from(expectedSign), Buffer.from(sign));
  }

  private buildCanonicalString(data: Record<string, any>): string {
    return Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('&');
  }
}
