import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';
import { CrearAsignacionDto } from './dto/crear-asignacion.dto';
import { CambiarEstadoDto } from './dto/cambiar-estado.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('asignaciones')
@UseGuards(JwtAuthGuard) // Todos los endpoints de asignaciones requieren login
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  // Admin ve todos los camiones del día — "Monitorear camiones"
  @Get('hoy')
  @UseGuards(RolesGuard)
  @Roles('admin')
  listarHoy() {
    return this.asignacionesService.listarHoy();
  }

  // Conductor ve solo SU hoja de ruta
  // @Request() extrae el usuario del JWT automáticamente
  @Get('mi-ruta')
  @UseGuards(RolesGuard)
  @Roles('conductor')
  miRuta(@Request() req: any) {
    return this.asignacionesService.hojaDeRuta(req.user.id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  crear(@Body() dto: CrearAsignacionDto) {
    return this.asignacionesService.crear(dto);
  }

  @Patch(':id/estado')
  @UseGuards(RolesGuard)
  @Roles('admin', 'conductor')
  cambiarEstado(@Param('id') id: string, @Body() dto: CambiarEstadoDto) {
    return this.asignacionesService.cambiarEstado(id, dto.estado);
  }
}