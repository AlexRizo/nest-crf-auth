import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TopicsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTopicDto: CreateTopicDto) {
    try {
      const topic = await this.prismaService.topic.create({
        data: createTopicDto,
      });
      return topic;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all topics`;
  }

  async findAllByExamId(examId: string) {
    const topics = await this.prismaService.topic.findMany({
      where: { examId, isActive: true },
    });

    if (!topics || topics.length === 0) {
      throw new NotFoundException('No se encontraron temas');
    }

    return topics;
  }

  async findOne(id: string) {
    const topic = await this.prismaService.topic.findUnique({
      where: { id, isActive: true },
    });

    if (!topic) {
      throw new NotFoundException('El tema no existe');
    }

    return topic;
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`;
  }

  remove(id: number) {
    return `This action removes a #${id} topic`;
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
