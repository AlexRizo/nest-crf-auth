import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { isUUID } from 'class-validator';

@Injectable()
export class TopicsService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger: Logger = new Logger(TopicsService.name);

  async create(createTopicDto: CreateTopicDto) {
    try {
      const topic = await this.prismaService.topic.create({
        data: {
          ...createTopicDto,
          code: `tema-${nanoid(5)}`,
        },
      });
      return topic;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAllByExamId(examId: string) {
    const topics = await this.prismaService.topic.findMany({
      where: { examId, isActive: true },
      include: {
        questions: true,
        groups: true,
      },
    });

    if (!topics || topics.length === 0) {
      throw new NotFoundException('No se encontraron temas');
    }

    return topics;
  }

  async findOne(term: string) {
    const where = isUUID(term) ? { id: term } : { code: term };

    const topic = await this.prismaService.topic.findUnique({
      where: { ...where, isActive: true },
    });

    if (!topic) {
      throw new NotFoundException('El tema no existe');
    }

    return topic;
  }

  async findOneWithExamCode(term: string, examCode: string) {
    const where = isUUID(term) ? { id: term } : { code: term };

    const topic = await this.prismaService.topic.findUnique({
      where: { ...where, isActive: true, exam: { code: examCode } },
      include: { exam: true },
    });

    if (!topic) {
      throw new NotFoundException('El tema no existe');
    }

    return topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto) {
    await this.findOne(id);

    try {
      const topic = await this.prismaService.topic.update({
        where: { id, isActive: true },
        data: updateTopicDto,
      });

      return topic;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      const topic = await this.prismaService.topic.update({
        where: { id, isActive: true },
        data: { isActive: false },
      });

      return topic;
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

    this.logger.error(
      'Ha ocurrido un error desconocido',
      JSON.stringify(error),
    );
    throw new InternalServerErrorException('Ha ocurrido un error desconocido');
  }
}
