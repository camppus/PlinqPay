import Password from '@/objectValues/Password';
import { CreateCompanieDTo } from '../dto/create.dto';
import Email from '@/objectValues/Email';
import PhoneNumber from '@/objectValues/Phone';
import { BadRequestException } from '@nestjs/common';
import { ITenatsRepositories } from '../repositories/@type';

export default class CreateCompanieUseCase {
  constructor(private readonly repo: ITenatsRepositories) {}
  public async execute(dto: CreateCompanieDTo) {
    const password = new Password(dto.password);
    const email = new Email(dto.email);
    const phone = new PhoneNumber(dto.phone);
    await this.verifyIfExist(email.getValue(), phone.getValue());
    const createdTenant = await this.repo.create({
      email: email.getValue(),
      password: password.getValue(),
      phone: phone.getValue(),
      title: dto.title,
    });
    const { data } = createdTenant;
    return {
      ...data,
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
