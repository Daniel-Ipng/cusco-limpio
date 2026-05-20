import { IsIn } from 'class-validator';

export class CambiarEstadoDto {
  @IsIn(['programada', 'en_curso', 'completada', 'cancelada'])
  estado: 'programada' | 'en_curso' | 'completada' | 'cancelada';
}