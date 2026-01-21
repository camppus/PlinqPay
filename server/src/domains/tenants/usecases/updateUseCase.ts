import { CreateCompanieDTo } from '../dto/create.dto';
import Email from '@/objectValues/Email';
import PhoneNumber from '@/objectValues/Phone';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ITenatsRepositories } from '../repositories/@type';
import { UpdateTenantDTO } from '../dto/updtae.dto';

export default class UpdateCompanieUseCase {
  constructor(private readonly repo: ITenatsRepositories) {}
  public async execute(dto: UpdateTenantDTO, id: string) {
    const email = new Email(dto.email);
    const phone = new PhoneNumber(dto.phone);
    await this.verifyIfExist(email.getValue(), phone.getValue());
    const updated = await this.repo.update(
      {
        email: email.getValue(),
        phone: phone.getValue(),
        title: dto.title,
      },
      id,
    );

    if (!updated) {
      throw new NotFoundException({
        message: 'Companie not found',
      });
    }
    return {
      ...updated?.data,
      password: null,
    };
  }

  private async verifyIfExist(email: string, phone: string) {
    const [userWithEmail, userWithPhoneNumber] = await Promise.all([
      this.repo.getByUnique(email),
      this.repo.getByUnique(phone),
    ]);

    if (userWithEmail || userWithPhoneNumber) {
      throw new BadRequestException({
        message: 'Tente dados diferentes , o teelfone ou email esta em uso',
      });
    }
  }
}
