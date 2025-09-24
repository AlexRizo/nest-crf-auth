import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExamDto {
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  title: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  description: string;
}
