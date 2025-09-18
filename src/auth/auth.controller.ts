import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import type { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import type { UserJwtPayload } from './interfaces/jwt.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto) {
    return this.authService.login(res, loginDto);
  }

  @Auth()
  @Get('me')
  checkAuth(@GetUser() user: User) {
    return this.authService.checkAuth(user.id);
  }

  @Auth()
  @Post('logout')
  logout(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: UserJwtPayload,
  ) {
    return this.authService.logout(res, user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: UserJwtPayload,
  ) {
    return this.authService.refresh(res, user.id, user.refreshToken);
  }
}
