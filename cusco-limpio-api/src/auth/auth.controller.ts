import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login — público, no requiere token
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // GET /auth/me — devuelve el usuario autenticado actual
  // El frontend lo usa al cargar para verificar si la sesión sigue activa
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req: any) {
    const { passwordHash: _, ...usuario } = req.user;
    return usuario;
  }
}