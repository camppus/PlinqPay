import { PaymentMethod } from '@prisma/client';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionClientDTO {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+244923000000' })
  @IsPhoneNumber('AO')
  phone: string;
}

export class TransactionCartItemDTO {
  @ApiProperty({
    example: 'Curso de NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 5000,
    description: 'Preço unitário do item',
  })
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({
    example: 2,
    description: 'Quantidade do item',
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateTransactionDTO {
  @ApiProperty({
    example: 'trx_123456',
    description: 'ID externo da transação no sistema do cliente',
  })
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @ApiProperty({
    example: 'https://meusite.com/webhook',
    description: 'URL de callback para confirmação do pagamento',
  })
  @IsUrl()
  callbackUrl: string;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.REFERENCE,
  })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    type: TransactionClientDTO,
  })
  @ValidateNested()
  @Type(() => TransactionClientDTO)
  client: TransactionClientDTO;

  @ApiProperty({
    type: [TransactionCartItemDTO],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionCartItemDTO)
  items: TransactionCartItemDTO[];

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Min(5_000 )
  amount: number;
}
