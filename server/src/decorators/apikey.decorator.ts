import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const CurrentApiKey = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const apikey = request.headers['api-key'];
    if (!apikey) {
      throw new BadRequestException({
        message: 'Api key não indentificado',
      });
    }
    return apikey;
  },
);
