import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zona } from './entities/zona.entity';

@Injectable()
export class ZonasService {
  constructor(
    @InjectRepository(Zona)
    private zonaRepository: Repository<Zona>,
  ) {}

  findAll(): Promise<Zona[]> {
    return this.zonaRepository.find();
  }

  findOne(id: number): Promise<Zona | null> {
    return this.zonaRepository.findOneBy({ id });
  }

  create(zona: Partial<Zona>): Promise<Zona> {
    const nuevaZona = this.zonaRepository.create(zona);
    return this.zonaRepository.save(nuevaZona);
  }

  async remove(id: number): Promise<void> {
    await this.zonaRepository.delete(id);
  }
}