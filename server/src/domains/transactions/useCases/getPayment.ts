import { ITransactionRepositorie } from '../repositories/@types';

export class GetPaymentUseCase {
  constructor(private readonly repo: ITransactionRepositorie) {}

  public async getAll(page: number, limit: number) {
    return await this.repo.getAll(page, limit);
  }

  public async getByTenant(page: number, limit: number, tenantId: string) {
    return await this.repo.getAllByTenant(page, limit, tenantId);
  }

  public async getById(id: string) {
    return await this.repo.getDetails(id);
  }
}
