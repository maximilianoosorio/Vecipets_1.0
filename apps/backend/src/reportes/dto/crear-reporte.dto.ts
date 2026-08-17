import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearReporteDto {
  @IsString()
  @IsNotEmpty({ message: 'El tipo de reporte es obligatorio' })
  tipoReporte: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  descripcion: string;

  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'La latitud debe ser numérica' })
  latitud: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'La longitud debe ser numérica' })
  longitud: number;

  @IsString()
  @IsNotEmpty({ message: 'La fecha del evento es obligatoria' })
  fechaEvento: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de la mascota es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La especie es obligatoria' })
  especie: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  tamano?: string;

  @IsOptional()
  @IsString()
  sexo?: string;
}