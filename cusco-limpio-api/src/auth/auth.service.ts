import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // 1. Buscar el usuario por email
    const usuario = await this.usuariosService.buscarPorEmail(dto.email);
    if (!usuario) {
      // Mensaje genérico — no revelar si el email existe o no
      // Esto es una buena práctica de seguridad
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Comparar la contraseña con el hash almacenado
    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Generar el JWT con los datos mínimos necesarios
    // sub es el estándar JWT para el identificador del usuario
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    const accessToken = this.jwtService.sign(payload);

    // 4. Devolver el token y los datos del usuario (sin el hash)
    const { passwordHash: _, ...usuarioSinHash } = usuario;
    return {
      accessToken,
      usuario: usuarioSinHash,
    };
  }
}