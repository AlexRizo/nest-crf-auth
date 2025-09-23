import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

enum StaffRoles {
  admin = 'admin',
  manager = 'manager',
  applicant = 'applicant',
}

export class UpdateStaffDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'El nombre de usuario solo puede contener letras, números y guiones',
  })
  @Transform(({ value }) => (value === '' ? null : (value as string)))
  username?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/, {
    message:
      'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial',
  })
  @Transform(({ value }) => (value === '' ? null : (value as string)))
  password?: string;

  @IsOptional()
  @IsEnum(StaffRoles)
  role?: StaffRoles;
}
