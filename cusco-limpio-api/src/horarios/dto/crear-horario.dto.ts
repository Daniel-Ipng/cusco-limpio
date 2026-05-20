import { IsString, IsInt, Min, Max, Matches } from 'class-validator';

export class CrearHorarioDto {
  @IsString()
  zonaId: string;

  // 0-6 representa domingo a sábado
  @IsInt()
  @Min(0)
  @Max(6)
  diaSemana: number;

  // Valida formato HH:MM:SS — ejemplo "06:00:00"
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'horaInicio debe tener formato HH:MM:SS',
  })
  horaInicio: string;

  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'horaFin debe tener formato HH:MM:SS',
  })
  horaFin: string;
}