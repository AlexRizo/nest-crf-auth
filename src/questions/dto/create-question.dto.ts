import { OmitType } from '@nestjs/mapped-types';
import { QuestionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateOptionDto } from 'src/options/dto/create-option.dto';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDtoWithOptions)
  options?: CreateQuestionDtoWithOptions[];

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  examId: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  topicId: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  groupId?: string;
}

class CreateQuestionDtoWithOptions extends OmitType(CreateOptionDto, [
  'questionId',
] as const) {}
