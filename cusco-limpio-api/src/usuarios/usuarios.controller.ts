import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Registro público — cualquiera puede crear cuenta
  @Post('registro')
  crear(@Body() dto: CrearUsuarioDto) {
    return this.usuariosService.crear(dto);
  }

  // Solo el admin puede ver la lista de usuarios
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  listar() {
    return this.usuariosService.listarTodos();
  }

  // Solo el admin puede eliminar usuarios
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  eliminar(@Param('id') id: string) {
    return this.usuariosService.eliminar(id);
  }
}