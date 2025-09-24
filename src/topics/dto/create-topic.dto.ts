import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  examId: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}
