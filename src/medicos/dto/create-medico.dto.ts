import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateMedicoDto {
  @IsString({ message: 'El nombre completo debe ser texto' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener mínimo 3 caracteres' })
  nombreCompleto: string;

  @IsString({ message: 'La tarjeta profesional debe ser texto' })
  @IsNotEmpty({ message: 'La tarjeta profesional es obligatoria' })
  tarjetaProfesional: string;

  @IsString({ message: 'La especialidad debe ser texto' })
  @IsNotEmpty({ message: 'La especialidad es obligatoria' })
  especialidad: string;

  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  @IsOptional()
  activo?: boolean;
}