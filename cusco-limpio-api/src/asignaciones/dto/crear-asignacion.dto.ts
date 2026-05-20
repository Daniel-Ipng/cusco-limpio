import { IsString, IsDateString } from 'class-validator';

export class CrearAsignacionDto {
  @IsString()
  zonaId: string;

  @IsString()
  vehiculoId: string;

  @IsString()
  conductorId: string;

  // Formato ISO: "2026-05-20"
  @IsDateString()
  fecha: string;
}