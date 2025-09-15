import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ password, ...rest }: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: bcrypt.hashSync(password, 10),
        },
      });

      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(term: string) {
    const where = isUUID(term) ? { id: term } : { username: term };

    const user = await this.prisma.user.findUnique({ where });

    if (!user) {
      throw new NotFoundException(
        `Usuario con el término '${term}' no encontrado`,
      );
    }

    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken },
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = (error.meta?.target ?? []) as string[];

      const field =
        target[0] === 'email' ? 'correo electrónico' : 'nombre de usuario';

      throw new ConflictException(`El ${field} ya está en uso`);
    }

    console.log(error);
    throw new InternalServerErrorException('Ha ocurrido un error desconocido');
  }
}
