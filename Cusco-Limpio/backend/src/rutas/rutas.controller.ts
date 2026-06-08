import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { Ruta } from './entities/ruta.entity';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get()
  findAll(): Promise<Ruta[]> {
    return this.rutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Ruta | null> {
    return this.rutasService.findOne(+id);
  }

  @Post()
  create(@Body() ruta: Partial<Ruta>): Promise<Ruta> {
    return this.rutasService.create(ruta);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() ruta: Partial<Ruta>): Promise<Ruta | null> {
    return this.rutasService.update(+id, ruta);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.rutasService.remove(+id);
  }
}