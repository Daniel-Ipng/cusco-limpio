import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../usuarios/usuarios.service';

// Esta estrategia define CÓMO se valida el JWT en cada request
// Passport la ejecuta automáticamente cuando usas JwtAuthGuard
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      // Extrae el token del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Si el token expiró, rechaza el request
      ignoreExpiration: false,
      // La misma clave secreta que usamos para firmar el token
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  // Este método se ejecuta DESPUÉS de verificar la firma del JWT
  // El payload es lo que guardamos cuando hacemos login
  // Lo que retornemos aquí queda disponible como req.user
  async validate(payload: { sub: string; email: string; rol: string }) {
    const usuario = await this.usuariosService.buscarPorId(payload.sub);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');
    return usuario;
  }
}