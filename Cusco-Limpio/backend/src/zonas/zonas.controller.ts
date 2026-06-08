import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { Zona } from './entities/zona.entity';

@Controller('zonas')
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) {}

  @Get()
  findAll(): Promise<Zona[]> {
    return this.zonasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Zona | null> {
    return this.zonasService.findOne(+id);
  }

  @Post()
  create(@Body() zona: Partial<Zona>): Promise<Zona> {
    return this.zonasService.create(zona);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.zonasService.remove(+id);
  }
}