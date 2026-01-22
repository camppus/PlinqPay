import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WebHooksEvents, WebHooksMethod, WebhooksScope } from '@prisma/client';

export class CreateWebhookDto {
  @ApiProperty({
    description: 'URL que receberá o webhook',
    example: 'https://meusite.com/webhooks/payment',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Nome identificador do webhook',
    example: 'Webhook de Pagamento',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Payload customizado enviado no webhook',
    example: { orderId: '{{transaction.id}}' },
  })
  @IsOptional()
  @IsObject()
  body?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Headers adicionais enviados no webhook',
    example: { Authorization: 'Bearer {{token}}' },
  })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @ApiProperty({
    enum: WebHooksMethod,
    description: 'Método HTTP do webhook',
    example: WebHooksMethod.POST,
  })
  @IsEnum(WebHooksMethod)
  method: WebHooksMethod;

  @ApiProperty({
    enum: WebhooksScope,
    description: 'Escopo de execução do webhook',
    example: WebhooksScope.PAYMENTS,
  })
  @IsEnum(WebhooksScope)
  scope: WebhooksScope;

  @ApiProperty({
    isArray: true,
    enum: WebHooksEvents,
    description: 'Eventos que disparam o webhook',
    example: [WebHooksEvents.SUCCESS],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(WebHooksEvents, { each: true })
  events: WebHooksEvents[];
}
