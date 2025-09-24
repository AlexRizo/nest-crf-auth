import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';
import { CreateExamTopicDto } from './dto/create-exam-topic.dto';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Auth(Roles.admin)
  @Post()
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Auth(Roles.admin)
  @Post(':term/topics')
  createTopic(
    @Body() createTopicDto: CreateExamTopicDto,
    @Param('term') term: string,
  ) {
    return this.examsService.createTopic(createTopicDto, term);
  }

  @Auth(Roles.admin, Roles.manager, Roles.applicant)
  @Get(':term/topics')
  findExamTopics(@Param('term') term: string) {
    return this.examsService.findExamTopics(term);
  }

  @Auth(Roles.admin, Roles.manager, Roles.applicant)
  @Get()
  findAll() {
    return this.examsService.findAll();
  }

  @Auth(Roles.admin, Roles.manager, Roles.applicant)
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.examsService.findOne(term);
  }

  @Auth(Roles.admin)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExamDto: UpdateExamDto,
  ) {
    return this.examsService.update(id, updateExamDto);
  }

  @Auth(Roles.admin)
  @Patch(':id/delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.examsService.remove(id);
  }
}
