import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

// Los DTOs (Data Transfer Objects) validan los datos
// que llegan en el body del request ANTES de llegar al servicio
// Si algo no cumple las reglas, NestJS responde 400 automáticamente
export class CrearUsuarioDto {
  @IsString()
  nombre: string;

  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsIn(['ciudadano', 'admin', 'conductor'])
  rol?: 'ciudadano' | 'admin' | 'conductor';

  @IsOptional()
  @IsString()
  zonaId?: string;
}