import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  topicId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  examId: string;

  @IsString()
  @IsOptional()
  content?: string;
}
