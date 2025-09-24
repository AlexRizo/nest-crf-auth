import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExamTopicDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}
