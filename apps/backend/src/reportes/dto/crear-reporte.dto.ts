import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';

export enum TipoReporte {
  PERDIDO = 'PERDIDO',
  ENCONTRADO = 'ENCONTRADO',
}

export class CrearReporteDto {
  // Datos de la Mascota
  @IsOptional()
  @IsString()
  nombreMascota?: string;

  @IsString()
  @IsNotEmpty()
  especie: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  tamano: string;

  @IsString()
  @IsNotEmpty()
  sexo: string;

  @IsOptional()
  @IsString()
  caracteristicasEspeciales?: string;

  // Datos del Reporte
  @IsEnum(TipoReporte, { message: 'El tipo de reporte debe ser PERDIDO o ENCONTRADO' })
  tipoReporte: TipoReporte;

  @IsDateString({}, { message: 'La fecha del evento debe ser una fecha válida (ISO 8601)' })
  fechaEvento: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;
}