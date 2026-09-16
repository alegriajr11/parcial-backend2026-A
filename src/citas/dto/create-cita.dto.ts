import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateCitaDto {
  @IsString({ message: 'El nombre del paciente debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del paciente es obligatorio' })
  pacienteNombre: string;

  @IsEmail({}, { message: 'El correo electrónico del paciente no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico del paciente es obligatorio' })
  pacienteCorreo: string;

  @IsString({ message: 'El motivo de la consulta debe ser texto' })
  @IsNotEmpty({ message: 'El motivo de la consulta es obligatorio' })
  motivoConsulta: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El costo debe ser un número con máximo 2 decimales' },
  )
  @IsPositive({ message: 'El costo debe ser un número positivo mayor a 0' })
  costo: number;

  @IsInt({ message: 'El medicoId debe ser un número entero' })
  @IsNotEmpty({ message: 'El medicoId es obligatorio para asignar la cita' })
  medicoId: number;
}