import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CrearHorarioDto } from './dto/crear-horario.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  // Público — el ciudadano consulta sin login
  // GET /horarios?zonaId=uuid-de-la-zona
  @Get()
  buscarPorZona(@Query('zonaId') zonaId: string) {
    return this.horariosService.buscarPorZona(zonaId);
  }

  // GET /horarios/hoy?zonaId=uuid-de-la-zona
  @Get('hoy')
  buscarHoy(@Query('zonaId') zonaId: string) {
    return this.horariosService.buscarHoy(zonaId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  crear(@Body() dto: CrearHorarioDto) {
    return this.horariosService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  actualizar(@Param('id') id: string, @Body() dto: Partial<CrearHorarioDto>) {
    return this.horariosService.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  eliminar(@Param('id') id: string) {
    return this.horariosService.eliminar(id);
  }
  @Get('todos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  listarTodos() {
    return this.horariosService.listarTodos();
  }
}