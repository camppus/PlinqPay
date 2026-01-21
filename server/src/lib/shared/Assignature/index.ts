import crytpo from 'node:crypto';

export default class Assignature {
  public genPublicKey(): string {
    return 'pk_' + crytpo.randomBytes(48).toString();
  }

  public genSecretKey(): string {
    return 'sk' + crytpo.randomBytes(48).toString();
  }

  public assignature(secretKey: string, payload: any): string {
    const assignature = crytpo
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');
    return assignature;
  }

  public genApiTitle() {
    return "api_" + crytpo.randomBytes(48).toString()
  }
}
