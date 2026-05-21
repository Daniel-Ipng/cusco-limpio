import { useState } from 'react'

const horariosPorZona: Record<string, { turno: string; hora: string; dias: string }[]> = {
  'wanchaq': [
    { turno: 'Mañana', hora: '06:00 - 08:00', dias: 'Lunes, Miércoles, Viernes' },
    { turno: 'Tarde', hora: '14:00 - 16:00', dias: 'Martes, Jueves' },
    { turno: 'Noche', hora: '20:00 - 22:00', dias: 'Sábado' },
  ],
  'santiago': [
    { turno: 'Madrugada', hora: '04:00 - 06:00', dias: 'Lunes, Jueves' },
    { turno: 'Mañana', hora: '07:00 - 09:00', dias: 'Martes, Viernes' },
    { turno: 'Tarde', hora: '15:00 - 17:00', dias: 'Miércoles, Sábado' },
  ],
  'cusco': [
    { turno: 'Mañana', hora: '06:00 - 08:00', dias: 'Lunes, Miércoles' },
    { turno: 'Tarde', hora: '13:00 - 15:00', dias: 'Martes, Jueves' },
    { turno: 'Noche', hora: '19:00 - 21:00', dias: 'Viernes, Sábado' },
  ],
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

function HomeCiudadano() {
  const [direccion, setDireccion] = useState('')
  const [horarios, setHorarios] = useState<{ turno: string; hora: string; dias: string }[] | null>(null)
  const [zonaEncontrada, setZonaEncontrada] = useState('')
  const [noEncontrado, setNoEncontrado] = useState(false)

  function buscarHorarios() {
    const texto = direccion.toLowerCase()
    const zona = Object.keys(horariosPorZona).find(z => texto.includes(z))
    if (zona) {
      setHorarios(horariosPorZona[zona])
      setZonaEncontrada(zona.charAt(0).toUpperCase() + zona.slice(1))
      setNoEncontrado(false)
    } else {
      setHorarios(null)
      setNoEncontrado(true)
      setZonaEncontrada('')
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
              placeholder="Ej: Wanchaq, Santiago, Cusco centro..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a7a5e]"
            />
            <button
              onClick={buscarHorarios}
              className="bg-[#1a7a5e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Resultado no encontrado */}
        {noEncontrado && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-6">
            <p className="text-sm text-red-600 font-medium">No encontramos horarios para esa dirección</p>
            <p className="text-xs text-red-400 mt-1">Intenta con: Wanchaq, Santiago o Cusco</p>
          </div>
        )}

        {/* Horarios encontrados */}
        {horarios && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-gray-700">
                Horarios para zona <span className="text-[#1a7a5e]">{zonaEncontrada}</span>
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {horarios.map((h, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${turnoColor[h.turno]}`}>
                    {turnoIcono[h.turno]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{h.turno}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{h.dias}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${turnoColor[h.turno]}`}>
                      {h.hora}
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