import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt.interface';

const refreshTokenExtractor = (req: Request): string | null => {
  return (req?.cookies?.['refresh_token'] as string) ?? null;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([refreshTokenExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET')!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const token = refreshTokenExtractor(req);
    // ? retorna el usuario y el token de refresh
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      roles: payload.roles,
      refreshToken: token,
    };
  }
}
