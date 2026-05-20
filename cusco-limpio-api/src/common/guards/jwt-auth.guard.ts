import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Este guard verifica que el request tenga un JWT válido
// en el header: Authorization: Bearer <token>
// Si el token no existe o expiró, responde 401 automáticamente
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    return user;
  }
}