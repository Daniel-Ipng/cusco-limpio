import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CrearVehiculoDto } from './dto/crear-vehiculo.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  // Admin y conductor pueden ver la flota
  @Get()
  @UseGuards(JwtAuthGuard)
  listar() {
    return this.vehiculosService.listar();
  }

  @Get('activos')
  @UseGuards(JwtAuthGuard)
  listarActivos() {
    return this.vehiculosService.listarActivos();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  crear(@Body() dto: CrearVehiculoDto) {
    return this.vehiculosService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  actualizar(@Param('id') id: string, @Body() dto: Partial<CrearVehiculoDto>) {
    return this.vehiculosService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  eliminar(@Param('id') id: string) {
    return this.vehiculosService.eliminar(id);
  }
}