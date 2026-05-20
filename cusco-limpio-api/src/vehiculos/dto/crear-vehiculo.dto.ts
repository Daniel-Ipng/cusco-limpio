import { IsString, IsIn, IsOptional, Length } from 'class-validator';

export class CrearVehiculoDto {
  @IsString()
  @Length(6, 10, { message: 'La placa debe tener entre 6 y 10 caracteres' })
  placa: string;

  @IsIn(['compactador', 'volquete', 'motofurgon'])
  tipo: 'compactador' | 'volquete' | 'motofurgon';

  @IsOptional()
  @IsIn(['activo', 'mantenimiento'])
  estado?: 'activo' | 'mantenimiento';
}