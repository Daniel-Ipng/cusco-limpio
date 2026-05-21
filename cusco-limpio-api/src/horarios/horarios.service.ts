import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from './horario.entity';
import { CrearHorarioDto } from './dto/crear-horario.dto';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private readonly horarioRepo: Repository<Horario>,
  ) {}

  // El ciudadano usa este método — consulta el horario de SU zona
  // ?zonaId=xxx en la URL filtra por zona específica
  async buscarPorZona(zonaId: string): Promise<Horario[]> {
    return this.horarioRepo.find({
      where: { zona: { id: zonaId } },
      relations: { zona: true },
      order: { diaSemana: 'ASC' },
    });
  }

  // Útil para mostrar el horario de HOY en la app del ciudadano
  // JavaScript: 0=domingo, 1=lunes, ..., 6=sábado
  async buscarHoy(zonaId: string): Promise<Horario | null> {
    const hoy = new Date().getDay();
    return this.horarioRepo.findOne({
      where: { zona: { id: zonaId }, diaSemana: hoy },
      relations:{zona: true},
    });
  }

  async crear(dto: CrearHorarioDto): Promise<Horario> {
    const horario = this.horarioRepo.create({
      zona: { id: dto.zonaId },
      diaSemana: dto.diaSemana,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
    });
    return this.horarioRepo.save(horario);
  }

  async actualizar(id: string, dto: Partial<CrearHorarioDto>): Promise<Horario> {
    const horario = await this.horarioRepo.findOne({ where: { id } });
    if (!horario) throw new NotFoundException('Horario no encontrado');
    Object.assign(horario, dto);
    return this.horarioRepo.save(horario);
  }

  async eliminar(id: string): Promise<void> {
    const horario = await this.horarioRepo.findOne({ where: { id } });
    if (!horario) throw new NotFoundException('Horario no encontrado');
    await this.horarioRepo.remove(horario);
  }
  async listarTodos(): Promise<Horario[]> {
    return this.horarioRepo.find({
      relations: { zona: true },
      order: { zona: { nombre: 'ASC' }, diaSemana: 'ASC' },
    });
  }
}