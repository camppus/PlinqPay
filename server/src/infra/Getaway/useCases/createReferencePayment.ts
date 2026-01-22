import { TransactionClientDTO } from '@/domains/transactions/dto/create.dto';
import { IGetawayReponse, PaymentStrategie } from '..';
import axios from 'axios';
import * as crypto from 'crypto';
import { BadRequestException, Logger } from '@nestjs/common';

export interface ReferenceReturnType {
  out_trade_no: string;
  reference_id: string;
  trade_no: string;
  entity_id: string;
  status: string;
  trade_token: string;
  dynamic_link: string;
}

export default class ReferencePayment implements PaymentStrategie {
  private loger = new Logger('RefencePayment Logger');
  private readonly API_URL = process.env.GETAWAY_API as string;
  private readonly paternId = process.env.PATHERID as string;
  private readonly privateKey = process.env.PRIVATE_KEY as string;

  public async pay(amount: string): Promise<IGetawayReponse> {
    const bizContentData = {
      cashier_type: 'SDK',
      payer_ip: '123.25.68.9',
      sale_product_code: '050200030',
      timeout_express: '15m',
      trade_info: {
        currency: 'AOA',
        out_trade_no: this.genIdentifier(),
        payee_identity: this.paternId,
        payee_identity_type: '1',
        price: parseFloat(amount),
        quantity: '1',
        subject: 'Reference Payment',
        total_amount: parseFloat(amount),
      },
      pay_method: {
        pay_product_code: '31',
        amount: parseFloat(amount),
        bank_code: 'REF',
      },
    };
    const encryptedBizContent = this.encryptAndBase64(
      JSON.stringify(bizContentData),
      this.privateKey,
    );
    const requestBody = {
      request_no: this.genIdentifier(),
      service: 'instant_trade',
      version: '1.0',
      partner_id: this.paternId,
      charset: 'UTF-8',
      language: 'pt',
      sign_type: 'RSA',
      timestamp: this.getCurrentTimestamp(),
      format: 'JSON',
      biz_content: encryptedBizContent,
    };
    const asignature = this.generateSignature(requestBody);
    for (const key in requestBody) {
      if (
        requestBody.hasOwnProperty(key) &&
        key !== 'sign' &&
        key !== 'sign_type'
      ) {
        requestBody[key] = encodeURIComponent(requestBody[key]);
      }
    }
    const response = await axios.post(this.API_URL, requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });
    this.loger.debug(response.data);
    const data: ReferenceReturnType = response.data?.biz_content;

    if (!data?.dynamic_link) {
      throw new BadRequestException({
        message: 'Erro ao procesar o pagamento',
      });
    }
    return {
      entitie: data.entity_id,
      reference: data.reference_id,
      payUrl: data.dynamic_link,
      id: data.out_trade_no,
      asignature,
    };
  }

  private generateSignature(requestBody: any) {
    const sortedKeys = Object.keys(requestBody).sort();
    const paramString = sortedKeys
      .filter((key) => key !== 'sign' && key !== 'sign_type')
      .map((key) => `${key}=${requestBody[key]}`)
      .join('&');

    const sign = crypto.createSign('RSA-SHA1');
    sign.update(paramString);
    const signature = sign.sign(this.privateKey, 'base64');

    requestBody.sign = signature;
    requestBody.sign_type = 'RSA';

    return signature;
  }

  private getCurrentTimestamp() {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  }

  private encryptAndBase64(data: string, privateKey: string) {
    const buf = Buffer.from(data, 'utf8');

    const keySize = 128; // 1024 / 8
    const maxChunk = keySize - 11;

    const encryptedChunks: Buffer[] = [];
    for (let offset = 0; offset < buf.length; offset += maxChunk) {
      const slice = buf.slice(offset, offset + maxChunk);

      const encrypted = crypto.privateEncrypt(
        { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
        slice,
      );

      encryptedChunks.push(encrypted);
    }

    return Buffer.concat(encryptedChunks).toString('base64');
  }

  private genIdentifier() {
    return `PLIQPAG_API_${Date.now()}`;
  }
}
