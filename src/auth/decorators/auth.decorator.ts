import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { Role } from './role.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const Auth = (...roles: Roles[]) => {
  return applyDecorators(Role(...roles), UseGuards(JwtAuthGuard));
};
