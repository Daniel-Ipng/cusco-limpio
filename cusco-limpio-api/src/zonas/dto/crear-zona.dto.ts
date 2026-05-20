import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CrearZonaDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}   