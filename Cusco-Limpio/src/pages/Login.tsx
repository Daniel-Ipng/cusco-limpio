import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../lib/axios'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data } = await api.post('/auth/login', { email, password })
      // Guarda el token y usuario en el store
      setAuth(data.usuario, data.accessToken)

      // Redirige según el rol
      if (data.usuario.rol === 'admin') navigate('/admin/vehiculos')
      else if (data.usuario.rol === 'conductor') navigate('/conductor')
      else navigate('/ciudadano')

    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1a7a5e] rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
            ♻️
          </div>
          <h1 className="text-xl font-bold text-gray-800">Panel municipal</h1>
          <p className="text-sm text-gray-500 mt-1">Cusco Limpio</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="admin@cusco.gob.pe"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a7a5e]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a7a5e]"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-[#1a7a5e] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors mt-2 disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <button
            onClick={() => navigate('/')}
            className="text-xs text-gray-400 text-center hover:text-gray-600 transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  )
}