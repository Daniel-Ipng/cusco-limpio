import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface Props {
  children: React.ReactNode
  roles?: ('admin' | 'ciudadano' | 'conductor')[]
}

// Este componente protege rutas — si no hay token redirige al login
// Si hay token pero el rol no coincide, redirige según el rol
export default function ProtectedRoute({ children, roles }: Props) {
  const { token, usuario } = useAuthStore()

  if (!token || !usuario) return <Navigate to="/login" replace />

  if (roles && !roles.includes(usuario.rol)) {
    if (usuario.rol === 'admin') return <Navigate to="/admin/vehiculos" replace />
    if (usuario.rol === 'ciudadano') return <Navigate to="/ciudadano" replace />
    if (usuario.rol === 'conductor') return <Navigate to="/conductor" replace />
  }

  return <>{children}</>
}