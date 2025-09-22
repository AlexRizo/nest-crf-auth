import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserJwtPayload } from '../interfaces/jwt.interface';

const cookieExtractor = (req: Request): string | null => {
  return (req?.cookies?.['access_token'] as string) ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET')!,
    });
  }

  validate(payload: UserJwtPayload) {
    // ? retorna el usuario
    return {
      id: payload.id,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };
  }
}
