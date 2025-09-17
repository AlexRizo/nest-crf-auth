import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role.decorator';
import { Roles, User } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: Roles[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) return true;

    const req: Request = context.switchToHttp().getRequest();
    const user = req.user as User;

    for (const role of validRoles) {
      if (user.roles.includes(role)) return true;
    }

    throw new ForbiddenException('Usuario no autorizado');
  }
}
