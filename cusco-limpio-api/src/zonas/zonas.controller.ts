import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { CrearZonaDto } from './dto/crear-zona.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('zonas')
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) {}

  // Público — ciudadano no necesita login para ver zonas disponibles
  @Get()
  listar() {
    return this.zonasService.listar();
  }

  @Get('todas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  listarTodas() {
    return this.zonasService.listarTodas();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  crear(@Body() dto: CrearZonaDto) {
    return this.zonasService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  actualizar(@Param('id') id: string, @Body() dto: Partial<CrearZonaDto>) {
    return this.zonasService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  desactivar(@Param('id') id: string) {
    return this.zonasService.desactivar(id);
  }
}