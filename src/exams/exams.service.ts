import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';
import { Prisma } from '@prisma/client';
import { TopicsService } from 'src/topics/topics.service';
import { isUUID } from 'class-validator';
import { CreateExamTopicDto } from './dto/create-exam-topic.dto';

@Injectable()
export class ExamsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly topicsService: TopicsService,
  ) {}

  private readonly logger: Logger = new Logger(ExamsService.name);

  async create(createExamDto: CreateExamDto) {
    try {
      const exam = await this.prismaService.exam.create({
        data: {
          ...createExamDto,
          code: `examen-${nanoid(5)}`,
        },
      });
      return exam;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async createTopic(createTopicDto: CreateExamTopicDto, term: string) {
    const exam = await this.findOne(term);

    try {
      const topic = await this.topicsService.create({
        ...createTopicDto,
        examId: exam.id,
      });

      return topic;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findExamTopics(term: string) {
    const exam = await this.findOne(term);

    const topics = await this.topicsService.findAllByExamId(exam.id);

    return topics;
  }

  async findOne(term: string) {
    const where = isUUID(term) ? { id: term } : { code: term };

    const exam = await this.prismaService.exam.findUnique({
      where: { ...where, isActive: true },
      include: {
        topics: true,
      },
    });

    if (!exam) {
      throw new NotFoundException('El examen no existe');
    }

    return exam;
  }

  async findAll() {
    return this.prismaService.exam.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        code: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { topics: true } },
        topics: true,
      },
    });
  }

  async update(id: string, updateExamDto: UpdateExamDto) {
    await this.findOne(id);

    try {
      const exam = await this.prismaService.exam.update({
        where: { id },
        data: updateExamDto,
      });

      return exam;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      const exam = await this.prismaService.exam.update({
        where: { id },
        data: { isActive: false },
      });

      return exam;
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
