import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TopicsModule } from 'src/topics/topics.module';
import { ExamsModule } from 'src/exams/exams.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [PrismaModule, TopicsModule, ExamsModule],
})
export class QuestionsModule {}
