import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';
import { isUUID } from 'class-validator';
import { TopicsService } from 'src/topics/topics.service';
import { ExamsService } from 'src/exams/exams.service';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly topicsService: TopicsService,
    private readonly examsService: ExamsService,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    try {
      const group = await this.prismaService.group.create({
        data: {
          ...createGroupDto,
          code: `grupo-${nanoid(5)}`,
        },
      });
      return group;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(term: string) {
    const where = isUUID(term) ? { id: term } : { code: term };

    const group = await this.prismaService.group.findUnique({
      where,
      include: {
        topic: true,
        exam: true,
        questions: true,
      },
    });

    if (!group) {
      throw new NotFoundException('La agrupación no existe');
    }

    return group;
  }

  async findAll() {
    const groups = await this.prismaService.group.findMany({
      include: {
        topic: true,
        exam: true,
        _count: { select: { questions: true } },
      },
    });
    return groups;
  }

  async findGroupsByExamAndTopic(examId: string) {
    await this.examsService.findOne(examId);

    const groups = await this.prismaService.group.findMany({
      where: { examId },
    });

    if (!groups || groups.length === 0) {
      throw new NotFoundException('No se encontraron grupos');
    }

    return groups;
  }
}
