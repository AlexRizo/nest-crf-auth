import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateStaffDto } from './dto/create-staff.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('staff')
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.usersService.create(createStaffDto);
  }

  @Post('student')
  createStudent(@Body() createStaffDto: CreateStaffDto) {
    return this.usersService.create(createStaffDto);
  }

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('users/:term')
  findOne(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }
}
