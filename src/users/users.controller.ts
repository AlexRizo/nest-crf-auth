import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from '@prisma/client';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(Roles.admin)
  @Post('staff')
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.usersService.create(createStaffDto);
  }

  @Auth(Roles.admin)
  @Patch('staff/:id')
  update(
    @Body() updateStaffDto: UpdateStaffDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersService.update(id, updateStaffDto);
  }

  @Post('student')
  createStudent(@Body() createStaffDto: CreateStaffDto) {
    return this.usersService.create(createStaffDto);
  }

  @Auth(Roles.admin)
  @Get()
  findAll(@Query() findAllQueryDto: FindAllQueryDto) {
    return this.usersService.findAll(findAllQueryDto);
  }

  @Get('users/:term')
  findOne(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }
}
