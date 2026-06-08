import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Camion } from './entities/camion.entity';

@Injectable()
export class CamionesService {
  constructor(
    @InjectRepository(Camion)
    private camionRepository: Repository<Camion>,
  ) {}

  findAll(): Promise<Camion[]> {
    return this.camionRepository.find();
  }

  findOne(id: number): Promise<Camion | null> {
    return this.camionRepository.findOneBy({ id });
  }

  create(camion: Partial<Camion>): Promise<Camion> {
    const nuevoCamion = this.camionRepository.create(camion);
    return this.camionRepository.save(nuevoCamion);
  }

  async update(id: number, camion: Partial<Camion>): Promise<Camion | null> {
    await this.camionRepository.update(id, camion);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.camionRepository.delete(id);
  }
}