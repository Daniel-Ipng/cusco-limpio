import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zona } from './zona.entity';
import { CrearZonaDto } from './dto/crear-zona.dto';

@Injectable()
export class ZonasService {
  constructor(
    @InjectRepository(Zona)
    private readonly zonaRepo: Repository<Zona>,
  ) {}

  async listar(): Promise<Zona[]> {
    // Solo devuelve zonas activas para el ciudadano
    return this.zonaRepo.find({ where: { activa: true } });
  }

  async listarTodas(): Promise<Zona[]> {
    // El admin ve todas incluyendo inactivas
    return this.zonaRepo.find();
  }

  async crear(dto: CrearZonaDto): Promise<Zona> {
    const zona = this.zonaRepo.create(dto);
    return this.zonaRepo.save(zona);
  }

  async actualizar(id: string, dto: Partial<CrearZonaDto>): Promise<Zona> {
    const zona = await this.zonaRepo.findOne({ where: { id } });
    if (!zona) throw new NotFoundException('Zona no encontrada');
    Object.assign(zona, dto);
    return this.zonaRepo.save(zona);
  }

  async desactivar(id: string): Promise<void> {
    // Borrado lógico — no eliminamos el registro
    // Los datos históricos se necesitan para los reportes del sprint 4
    const zona = await this.zonaRepo.findOne({ where: { id } });
    if (!zona) throw new NotFoundException('Zona no encontrada');
    zona.activa = false;
    await this.zonaRepo.save(zona);
  }

  async buscarPorId(id: string): Promise<Zona> {
    const zona = await this.zonaRepo.findOne({ where: { id } });
    if (!zona) throw new NotFoundException('Zona no encontrada');
    return zona;
  }
}