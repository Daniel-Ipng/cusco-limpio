import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import { useAuthStore } from '../store/authStore'

interface Horario {
  id: string
  diaSemana: number
  horaInicio: string
  horaFin: string
  zona: { id: string; nombre: string }
}

const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function HomeCiudadano() {
  const { usuario, logout } = useAuthStore()
  const navigate = useNavigate()
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [horarioHoy, setHorarioHoy] = useState<Horario | null>(null)
  const [loading, setLoading] = useState(true)
  const [zonas, setZonas] = useState<{ id: string; nombre: string }[]>([])
  const [zonaSeleccionada, setZonaSeleccionada] = useState(usuario?.zona?.id ?? '')

  useEffect(() => {
    api.get('/zonas').then(res => setZonas(res.data))
  }, [])

  useEffect(() => {
    if (!zonaSeleccionada) { setLoading(false); return }
    setLoading(true)
    Promise.all([
      api.get(`/horarios?zonaId=${zonaSeleccionada}`),
      api.get(`/horarios/hoy?zonaId=${zonaSeleccionada}`),
    ]).then(([h, hoy]) => {
      setHorarios(h.data)
      setHorarioHoy(hoy.data)
    }).finally(() => setLoading(false))
  }, [zonaSeleccionada])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const nombreZona = zonas.find(z => z.id === zonaSeleccionada)?.nombre ?? ''

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#1a7a5e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-lg">
            ♻️
          </div>
          <div>
            <p className="font-bold text-white">Cusco Limpio</p>
            <p className="text-xs text-green-200">Sistema de recolección de residuos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-green-100">Hola, {usuario?.nombre}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-green-200 hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10">

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¿Cuándo recogen la basura en tu zona?
          </h1>
          <p className="text-sm text-gray-500">
            Selecciona tu zona para ver los horarios de recolección
          </p>
        </div>

        {/* Selector de zona */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <label className="text-xs font-medium text-gray-500 mb-2 block">
            📍 Tu zona de recolección
          </label>
          <select
            value={zonaSeleccionada}
            onChange={e => setZonaSeleccionada(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a7a5e]"
          >
            <option value="">Selecciona tu zona...</option>
            {zonas.map(z => (
              <option key={z.id} value={z.id}>{z.nombre}</option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="text-center text-gray-400 text-sm">Cargando horarios...</p>
        )}

        {/* Horario de hoy */}
        {!loading && zonaSeleccionada && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Hoy — {dias[new Date().getDay()]}
              </span>
            </div>

            {horarioHoy ? (
              <div className="bg-[#1a7a5e] rounded-xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl">
                  🚛
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">
                    Recolección programada hoy
                  </p>
                  <p className="text-xs text-green-200 mt-0.5">
                    Zona {nombreZona}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">
                    {horarioHoy.horaInicio.slice(0, 5)}
                  </span>
                  <p className="text-xs text-green-200">
                    hasta {horarioHoy.horaFin.slice(0, 5)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">
                  No hay recolección programada para hoy en tu zona
                </p>
              </div>
            )}
          </div>
        )}

        {/* Horario semanal */}
        {!loading && horarios.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Horario semanal — {nombreZona}
            </p>
            <div className="flex flex-col gap-3">
              {horarios.map((h) => (
                <div
                  key={h.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-700">
                      {dias[h.diaSemana].slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">
                      {dias[h.diaSemana]}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                      {h.horaInicio.slice(0, 5)} - {h.horaFin.slice(0, 5)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">
              🚛 Saca tu basura 15 minutos antes del horario indicado
            </p>
          </div>
        )}

        {/* Sin zona seleccionada */}
        {!loading && !zonaSeleccionada && (
          <div className="text-center text-gray-400 mt-8">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="text-sm">Selecciona tu zona para ver los horarios</p>
          </div>
        )}

      </div>
    </div>
  )
}