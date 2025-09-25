import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TopicsModule } from 'src/topics/topics.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [PrismaModule, TopicsModule],
})
export class QuestionsModule {}
