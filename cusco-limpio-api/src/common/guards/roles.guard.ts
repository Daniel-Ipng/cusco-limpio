import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

// Este guard lee los roles permitidos del decorador @Roles()
// y verifica que el usuario autenticado tenga uno de esos roles
// Si no tiene el rol, responde 403 Forbidden
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Leer los roles requeridos del decorador @Roles()
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si el endpoint no tiene @Roles(), cualquier usuario autenticado puede acceder
    if (!rolesRequeridos) return true;

    // El usuario viene del JWT, que JwtAuthGuard ya validó antes
    const { user } = context.switchToHttp().getRequest();

    if (!rolesRequeridos.includes(user.rol)) {
      throw new ForbiddenException(
        `Acceso denegado. Se requiere rol: ${rolesRequeridos.join(' o ')}`,
      );
    }

    return true;
  }
}