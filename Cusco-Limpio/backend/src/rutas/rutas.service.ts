import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ruta } from './entities/ruta.entity';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(Ruta)
    private rutaRepository: Repository<Ruta>,
  ) {}

  findAll(): Promise<Ruta[]> {
  return this.rutaRepository.find({ relations: { camion: true } });
}

findOne(id: number): Promise<Ruta | null> {
  return this.rutaRepository.findOne({ where: { id }, relations: { camion: true } });
}

  create(ruta: Partial<Ruta>): Promise<Ruta> {
    const nuevaRuta = this.rutaRepository.create(ruta);
    return this.rutaRepository.save(nuevaRuta);
  }

  async update(id: number, ruta: Partial<Ruta>): Promise<Ruta | null> {
    await this.rutaRepository.update(id, ruta);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.rutaRepository.delete(id);
  }
}