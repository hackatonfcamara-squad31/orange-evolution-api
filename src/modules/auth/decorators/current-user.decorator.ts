import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../../modules/users/entities/user.entity';
import { AuthRequest } from '../dtos/AuthRequest';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
