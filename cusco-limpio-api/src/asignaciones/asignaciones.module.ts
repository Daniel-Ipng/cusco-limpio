import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionesController } from './asignaciones.controller';
import { AsignacionesService } from './asignaciones.service';
import { Asignacion } from './asignacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asignacion])],
  controllers: [AsignacionesController],
  providers: [AsignacionesService],
  exports: [AsignacionesService],
})
export class AsignacionesModule {}