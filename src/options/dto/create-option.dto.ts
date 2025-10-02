import { Letter } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Letter)
  letter: Letter;
}
