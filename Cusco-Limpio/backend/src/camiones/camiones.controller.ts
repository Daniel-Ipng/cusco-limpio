import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CamionesService } from './camiones.service';
import { Camion } from './entities/camion.entity';

@Controller('camiones')
export class CamionesController {
  constructor(private readonly camionesService: CamionesService) {}

  @Get()
  findAll(): Promise<Camion[]> {
    return this.camionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Camion | null> {
    return this.camionesService.findOne(+id);
  }

  @Post()
  create(@Body() camion: Partial<Camion>): Promise<Camion> {
    return this.camionesService.create(camion);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() camion: Partial<Camion>): Promise<Camion | null> {
    return this.camionesService.update(+id, camion);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.camionesService.remove(+id);
  }
}