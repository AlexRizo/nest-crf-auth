import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}
  async create({ password, ...rest }: CreateStaffDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: bcrypt.hashSync(password, 10),
        },
        omit: { password: true, refreshToken: true },
      });

      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateStaff(id: string, updateStaffDto: UpdateStaffDto) {
    await this.findOne(id);

    try {
      const dataToUpdate = { ...updateStaffDto };

      if (updateStaffDto.password) {
        dataToUpdate.password = bcrypt.hashSync(updateStaffDto.password, 10);
      }

      Object.keys(dataToUpdate).forEach(
        key =>
          (dataToUpdate[key] === undefined ||
            dataToUpdate[key] === null ||
            dataToUpdate[key] === '') &&
          delete dataToUpdate[key],
      );

      const user = await this.prisma.user.update({
        where: { id, isActive: true },
        data: dataToUpdate,
        omit: { password: true, refreshToken: true },
      });

      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deleteStaff(id: string) {
    await this.findOne(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      omit: { password: true, refreshToken: true },
    });

    return user;
  }

  async findAll({ staff, students }: FindAllQueryDto) {
    const where: Prisma.UserWhereInput = {};

    if (staff && !students) {
      where.role = { in: ['admin', 'manager', 'applicant'] };
    } else if (students && !staff) {
      where.role = { in: ['student'] };
    } else {
      where.role = { in: ['admin', 'manager', 'applicant', 'student'] };
    }

    const users = await this.prisma.user.findMany({
      where: { ...where, isActive: true },
      omit: { password: true, refreshToken: true },
    });

    return users;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email, isActive: true },
    });

    return user;
  }

  async findOne(term: string) {
    const where = isUUID(term) ? { id: term } : { username: term };

    const user = await this.prisma.user.findUnique({
      where: { ...where, isActive: true },
      omit: { password: true, refreshToken: true },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario con el término '${term}' no encontrado`,
      );
    }

    return user;
  }

  async findOneForAuth(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario con el término '${id}' no encontrado`,
      );
    }

    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    try {
      await this.prisma.user.update({
        where: { id: userId, isActive: true },
        data: { refreshToken },
        omit: { password: true, refreshToken: true },
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updateLastLogin(userId: string) {
    await this.prisma.user.update({
      where: { id: userId, isActive: true },
      data: { last_login: new Date() },
    });
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

    this.logger.error(
      'Ha ocurrido un error desconocido',
      JSON.stringify(error),
    );
    throw new InternalServerErrorException('Ha ocurrido un error desconocido');
  }
}
