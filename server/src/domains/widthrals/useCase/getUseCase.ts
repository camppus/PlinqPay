import { IWidthdrawsRepositories } from '../repositories/@types';

export class GetWidthdrawlUsecase {
  constructor(private readonly widthrawlRepo: IWidthdrawsRepositories) {}

  public async exute(page: number, limit: number) {
    const widthdrawls = await this.widthrawlRepo.getAll(page, limit);
    return widthdrawls;
  }

  public async getBytenant(page: number, limit: number, tenantId: string) {
    const widthdrawls = await this.widthrawlRepo.getAllBytenant(
      page,
      limit,
      tenantId,
    );
    return widthdrawls;
  }
}
