import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExamsModule } from 'src/exams/exams.module';
import { TopicsModule } from 'src/topics/topics.module';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [PrismaModule, TopicsModule, ExamsModule],
})
export class GroupsModule {}
