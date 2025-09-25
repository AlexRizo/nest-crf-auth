import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;

  @IsString()
  @IsNotEmpty()
  questionId: string;
}
