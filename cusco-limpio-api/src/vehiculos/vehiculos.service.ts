import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';
import { CrearVehiculoDto } from './dto/crear-vehiculo.dto';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepo: Repository<Vehiculo>,
  ) {}

  async listar(): Promise<Vehiculo[]> {
    return this.vehiculoRepo.find();
  }

  // En el sprint 3 esto se usará para
  // mostrar solo vehículos disponibles al asignar rutas
  async listarActivos(): Promise<Vehiculo[]> {
    return this.vehiculoRepo.find({ where: { estado: 'activo' } });
  }

  async crear(dto: CrearVehiculoDto): Promise<Vehiculo> {
    const existe = await this.vehiculoRepo.findOne({
      where: { placa: dto.placa },
    });
    if (existe) throw new ConflictException('La placa ya está registrada');

    const vehiculo = this.vehiculoRepo.create(dto);
    return this.vehiculoRepo.save(vehiculo);
  }

  async actualizar(id: string, dto: Partial<CrearVehiculoDto>): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepo.findOne({ where: { id } });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    Object.assign(vehiculo, dto);
    return this.vehiculoRepo.save(vehiculo);
  }

  async eliminar(id: string): Promise<void> {
    const vehiculo = await this.vehiculoRepo.findOne({ where: { id } });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    await this.vehiculoRepo.remove(vehiculo);
  }
}