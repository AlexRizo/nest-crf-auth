import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';
import { isUUID } from 'class-validator';

@Injectable()
export class GroupsService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
