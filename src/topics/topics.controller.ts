import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Auth(Roles.admin)
  @Post()
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Auth(Roles.admin, Roles.manager, Roles.applicant)
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.topicsService.findOne(term);
  }

  @Auth(Roles.admin, Roles.manager, Roles.applicant)
  @Get(':term/exam/:examCode')
  findOneWithExamCode(
    @Param('term') term: string,
    @Param('examCode') examCode: string,
  ) {
    return this.topicsService.findOneWithExamCode(term, examCode);
  }

  @Auth(Roles.admin)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Auth(Roles.admin)
  @Patch(':id/delete')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.topicsService.remove(id);
  }
}
