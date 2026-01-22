import { Logger } from '@nestjs/common';
import { WebHooks } from '@prisma/client';

export class ExecuteWebHook {
  private readonly logger = new Logger(ExecuteWebHook.name);

  public async execute(data: WebHooks) {
    const headers = this.convertToObject(data.headers);
    const body = this.convertToObject(data.body);

    const apiCall = await fetch(`${data.url}`, {
      method: data.method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body ?? {}),
    });

    const response = await apiCall.json();
    this.logger.debug(response);
  }

  private convertToObject(data: any): Record<string, string> | null {
    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }
}
