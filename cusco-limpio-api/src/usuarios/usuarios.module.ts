import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';

// TypeOrmModule.forFeature([Usuario]) le dice a NestJS:
// "este módulo necesita acceso a la tabla usuarios"
@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  // exports permite que AuthModule use UsuariosService
  // para buscar usuarios durante el login
  exports: [UsuariosService],
})
export class UsuariosModule {}