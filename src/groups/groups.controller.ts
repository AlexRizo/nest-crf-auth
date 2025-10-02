import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Auth(Roles.admin)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Auth(Roles.admin, Roles.manager, Roles.applicant)
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Auth(Roles.admin, Roles.manager, Roles.applicant)
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.groupsService.findOne(term);
  }

  @Auth(Roles.admin, Roles.manager, Roles.applicant)
  @Get('exam/:examId')
  findGroupsByExamAndTopic(@Param('examId') examId: string) {
    return this.groupsService.findGroupsByExamAndTopic(examId);
  }
}
