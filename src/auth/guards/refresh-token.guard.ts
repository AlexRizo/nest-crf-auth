import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from './interfaces/guard.interface';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  handleRequest<TUser = AuthenticatedUser>(
    err: any,
    user: any,
    info: Error & { message: string },
  ): TUser {
    if (err) throw err;

    if (!user) {
      const message = info?.message ?? 'El token no es válido o ha expirado';
      throw new UnauthorizedException({
        statusCode: 401,
        message,
        error: 'Unauthorized',
      });
    }
    return user as TUser;
  }
}
