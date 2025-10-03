import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';
import { isUUID } from 'class-validator';
import { TopicsService } from 'src/topics/topics.service';
import { ExamsService } from 'src/exams/exams.service';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly topicsService: TopicsService,
    private readonly examsService: ExamsService,
  ) {}

  private readonly logger: Logger = new Logger(QuestionsService.name);

  async create({ options, ...rest }: CreateQuestionDto) {
    try {
      const question = await this.prismaService.question.create({
        data: {
          ...rest,
          code: `pregunta-${nanoid(5)}`,
          options: {
            create: options,
          },
        },
        include: {
          options: true,
        },
      });

      return question;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    const where = isUUID(term) ? { id: term } : { code: term };

    const question = await this.prismaService.question.findUnique({
      where: { ...where },
      include: {
        options: true,
        group: true,
        topic: true,
      },
    });

    if (!question) {
      throw new NotFoundException('La pregunta no existe');
    }

    return question;
  }

  async findAllQuestionsByTopicTerm(topicTerm: string) {
    const topic = await this.topicsService.findOne(topicTerm);

    const questions = await this.prismaService.question.findMany({
      where: { topicId: topic.id, isActive: true },
      include: {
        options: true,
        group: true,
        topic: true,
      },
    });

    if (!questions || questions.length === 0) {
      throw new NotFoundException('No se encontraron preguntas');
    }

    return questions;
  }

  async findAllByExam(examId: string) {
    await this.examsService.findOne(examId);

    const questions = await this.prismaService.question.findMany({
      where: { examId, isActive: true },
      include: {
        options: true,
        group: true,
        topic: true,
      },
    });

    if (!questions || questions.length === 0) {
      throw new NotFoundException('No se encontraron preguntas');
    }

    return questions;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    await this.findOne(id);

    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }

  private handleDBExceptions(error: unknown) {
    if (error instanceof Error) {
      this.logger.error('Ha ocurrido un error desconocido', error.stack);
    } else {
      this.logger.error(
        'Ha ocurrido un error desconocido',
        JSON.stringify(error),
      );
    }

    throw new InternalServerErrorException('Ha ocurrido un error desconocido');
  }
}
