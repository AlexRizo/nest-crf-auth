import { Letter } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @IsEnum(Letter)
  letter: Letter;
}
