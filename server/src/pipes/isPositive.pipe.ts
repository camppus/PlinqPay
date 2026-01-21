import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class IsPositiveNumberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const parsedNumberValue = Number(value);

    if (parsedNumberValue <= 0) {
      throw new BadRequestException({
        message: 'O valor precisa ser maior ou igual a 0',
      });
    }
    return parsedNumberValue;
  }
}
