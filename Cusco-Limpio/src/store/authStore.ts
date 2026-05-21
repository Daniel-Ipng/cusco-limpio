import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: 'ciudadano' | 'admin' | 'conductor'
  zona?: { id: string; nombre: string }
}

interface AuthState {
  usuario: Usuario | null
  token: string | null
  setAuth: (usuario: Usuario, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      setAuth: (usuario, token) => {
        localStorage.setItem('token', token)
        set({ usuario, token })
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ usuario: null, token: null })
      },
    }),
    { name: 'auth' }
  )
)