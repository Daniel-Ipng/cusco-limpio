import { SetMetadata } from '@nestjs/common';

// Este decorador simplemente adjunta los roles permitidos
// como metadata al endpoint. El RolesGuard los lee después.
// Uso: @Roles('admin') o @Roles('admin', 'conductor')
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);