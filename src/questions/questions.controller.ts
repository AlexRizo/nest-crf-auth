import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Auth(Roles.admin)
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto);
  }

  @Auth(Roles.admin, Roles.manager, Roles.applicant)
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.questionsService.findOne(term);
  }

  @Auth(Roles.admin, Roles.manager, Roles.applicant)
  @Get('topic/:topicTerm')
  findAllQuestionsByTopicTerm(@Param('topicTerm') topicTerm: string) {
    return this.questionsService.findAllQuestionsByTopicTerm(topicTerm);
  }

  @Auth(Roles.admin)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(+id);
  }
}
