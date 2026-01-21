import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];
    if (!userId) {
      throw new BadRequestException({
        message : "Não foi possivel indentificar quem é , por favor tente fazer o login"
      })
    }
    return userId
  },
);
