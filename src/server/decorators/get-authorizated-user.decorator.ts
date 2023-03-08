import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

const GetAuthorizedUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    return Reflect.getMetadata('user', ctx.getHandler()) as User;
  },
);
export default GetAuthorizedUser;
