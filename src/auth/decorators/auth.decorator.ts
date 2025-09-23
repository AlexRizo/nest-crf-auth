import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { Role } from './role.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserRoleGuard } from '../guards/user-role-.guard';

export const Auth = (...roles: Roles[]) => {
  return applyDecorators(
    Role(...roles),
    UseGuards(JwtAuthGuard, UserRoleGuard),
  );
};
