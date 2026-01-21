import { ApiKeyRepositorie } from '../repositories/@types';

export default class ToogleApiKeyUseCase {
  constructor(private readonly repo: ApiKeyRepositorie) {}

  public async execute(id: string) {
    const updated = await this.repo.toogle(id);
    return updated;
  }
}
