import { ITenatsRepositories } from '../repositories/@type';

export class GetAllsTenantsUseCase {
  constructor(private readonly repo: ITenatsRepositories) {}

  public async getAll(cursor: number, limit: number) {
    const allTenats = await this.repo.get(cursor, limit);
    return allTenats;
  }

  public async getByUnique(unique: string) {
    const tenant = await this.repo.getByUnique(unique);
    return tenant;
  }
}
