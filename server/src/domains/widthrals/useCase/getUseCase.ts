import { IWidthdrawsRepositories } from '../repositories/@types';

export class GetWidthdrawlUsecase {
  constructor(private readonly widthrawlRepo: IWidthdrawsRepositories) {}

  public async exute(page: number, limit: number) {
    const widthdrawls = await this.widthrawlRepo.getAll(page, limit);
    return widthdrawls;
  }
}
