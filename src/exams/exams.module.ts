import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TopicsModule } from 'src/topics/topics.module';

@Module({
  controllers: [ExamsController],
  providers: [ExamsService],
  imports: [PrismaModule, TopicsModule],
  exports: [ExamsService],
})
export class ExamsModule {}
