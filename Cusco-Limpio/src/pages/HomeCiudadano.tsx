import { useState } from 'react'

interface Horario {
  turno: string
  hora_inicio: string
  hora_fin: string
  dias: string
}

const turnoColor: Record<string, string> = {
  'Madrugada': 'bg-purple-100 text-purple-700',
  'Mañana': 'bg-yellow-100 text-yellow-700',
  'Tarde': 'bg-orange-100 text-orange-700',
  'Noche': 'bg-blue-100 text-blue-700',
}

const turnoIcono: Record<string, string> = {
  'Madrugada': '🌙',
  'Mañana': '🌅',
  'Tarde': '☀️',
  'Noche': '🌃',
}

function formatHora(hora: string) {
  return hora.slice(0, 5)
}

function HomeCiudadano() {
  const [direccion, setDireccion] = useState('')
  const [horarios, setHorarios] = useState<Horario[] | null>(null)
  const [zonaEncontrada, setZonaEncontrada] = useState('')
  const [noEncontrado, setNoEncontrado] = useState(false)
  const [cargando, setCargando] = useState(false)

  async function buscarHorarios() {
    if (!direccion.trim()) return
    setCargando(true)
    setNoEncontrado(false)
    setHorarios(null)

    try {
      const response = await fetch(`http://localhost:3000/api/horarios/${encodeURIComponent(direccion)}`)
      if (response.status === 404) {
        setNoEncontrado(true)
        setZonaEncontrada('')
      } else {
        const data = await response.json()
        setHorarios(data)
        setZonaEncontrada(direccion)
      }
    } catch (error) {
      setNoEncontrado(true)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-[#1a7a5e] px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-lg">
          ♻️
        </div>
        <div>
          <p className="font-bold text-white">Cusco Limpio</p>
          <p className="text-xs text-green-200">Sistema de recolección de residuos</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10">

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¿Cuándo recogen la basura en tu zona?
          </h1>
          <p className="text-sm text-gray-500">
            Escribe tu dirección o zona para ver los horarios de recolección
          </p>
        </div>

        {/* Buscador */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <label className="text-xs font-medium text-gray-500 mb-2 block">
            📍 Tu dirección o zona
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscarHorarios()}
              placeholder="Ej: San Blas, San Pedro, Magisterio..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a7a5e]"
            />
            <button
              onClick={buscarHorarios}
              disabled={cargando}
              className="bg-[#1a7a5e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors disabled:opacity-50"
            >
              {cargando ? '...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* No encontrado */}
        {noEncontrado && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-6">
            <p className="text-sm text-red-600 font-medium">No encontramos horarios para esa zona</p>
            <p className="text-xs text-red-400 mt-1">Intenta con: San Blas, San Pedro, Magisterio, Santiago...</p>
          </div>
        )}

        {/* Horarios */}
        {horarios && (
          <div>
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-700">
                Horarios para <span className="text-[#1a7a5e]">{zonaEncontrada}</span>
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {horarios.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${turnoColor[h.turno] || 'bg-gray-100 text-gray-700'}`}>
                    {turnoIcono[h.turno] || '🕐'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{h.turno}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{h.dias}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${turnoColor[h.turno] || 'bg-gray-100 text-gray-700'}`}>
                      {formatHora(h.hora_inicio)} - {formatHora(h.hora_fin)}
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

      </div>
    </div>
  )
}

export default HomeCiudadano