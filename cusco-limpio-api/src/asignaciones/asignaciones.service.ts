import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignacion } from './asignacion.entity';
import { CrearAsignacionDto } from './dto/crear-asignacion.dto';

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepo: Repository<Asignacion>,
  ) {}

  // Monitorear camiones del día — usado por el admin
  // Devuelve todas las asignaciones de hoy con sus relaciones
  async listarHoy(): Promise<Asignacion[]> {
    const hoy = new Date().toISOString().split('T')[0];
    return this.asignacionRepo.find({
      where: { fecha: hoy },
      relations: { zona: true, vehiculo: true, conductor: true },
    });
  }

  // Hoja de ruta del conductor — solo VE sus propias asignaciones
  async hojaDeRuta(conductorId: string): Promise<Asignacion[]> {
    const hoy = new Date().toISOString().split('T')[0];
    return this.asignacionRepo.find({
      where: { conductor: { id: conductorId }, fecha: hoy },
      relations: { zona: true, vehiculo: true },
    });
  }

  async crear(dto: CrearAsignacionDto): Promise<Asignacion> {
    const asignacion = this.asignacionRepo.create({
      zona: { id: dto.zonaId },
      vehiculo: { id: dto.vehiculoId },
      conductor: { id: dto.conductorId },
      fecha: dto.fecha,
    });
    return this.asignacionRepo.save(asignacion);
  }

  async cambiarEstado(
    id: string,
    estado: 'programada' | 'en_curso' | 'completada' | 'cancelada',
  ): Promise<Asignacion> {
    const asignacion = await this.asignacionRepo.findOne({ where: { id } });
    if (!asignacion) throw new NotFoundException('Asignación no encontrada');
    asignacion.estado = estado;
    return this.asignacionRepo.save(asignacion);
  }
}