const vehiculos = [
  { id: 'ABC-123', tipo: 'Compactador', capacidad: '12 ton', km: '45.230 km', estado: 'disponible' },
  { id: 'DEF-456', tipo: 'Compactador', capacidad: '12 ton', km: '52.430 km', estado: 'en_ruta', conductor: 'Carlos Mendoza', zona: 'Santiago - Zona B' },
  { id: 'DEF-456', tipo: 'Reciclador', capacidad: '8 ton', km: '78.900 km', estado: 'mantenimiento', disponible: '2 dias' },
  { id: 'JKL-012', tipo: 'Compactador', capacidad: '12 ton', km: '32.100 km', estado: 'disponible' },
  { id: 'DEF-456', tipo: 'Reciclador', capacidad: '8 ton', km: '78.900 km', estado: 'fuera_servicio' },
  { id: 'DEF-456', tipo: 'Compactador', capacidad: '12 ton', km: '52.430 km', estado: 'en_ruta', conductor: 'Augusto Fernando', zona: 'Wanchaq - Zona A' },
  { id: 'ABC-123', tipo: 'Compactador', capacidad: '12 ton', km: '45.230 km', estado: 'disponible' },
  { id: 'JKL-012', tipo: 'Compactador', capacidad: '12 ton', km: '32.100 km', estado: 'disponible' },
]

const estadoBadge: Record<string, string> = {
  disponible: 'bg-green-100 text-green-700',
  en_ruta: 'bg-blue-100 text-blue-700',
  mantenimiento: 'bg-gray-100 text-gray-600',
  fuera_servicio: 'bg-red-100 text-red-600',
}

const estadoLabel: Record<string, string> = {
  disponible: 'Disponible',
  en_ruta: 'En Ruta',
  mantenimiento: 'En Mantenimiento',
  fuera_servicio: 'Fuera de servicio',
}

function AsignarVehiculo() {
  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Asignar Vehículo</h1>
          <p className="text-sm text-gray-500">Gestión de la flota de vehículos</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1a7a5e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors">
          + Agregar turno
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: '🚛', valor: 25, label: 'Total flota' },
          { icon: '✅', valor: 3, label: 'Disponibles' },
          { icon: '🚚', valor: 15, label: 'En ruta' },
          { icon: '⚠️', valor: 2, label: 'No operativos' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.valor}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Flota */}
      <h2 className="text-base font-semibold text-gray-700 mb-4">Flota de vehículos</h2>
      <div className="grid grid-cols-4 gap-4">
        {vehiculos.map((v, i) => (
          <div key={i} className={`bg-white border rounded-xl p-4 flex flex-col gap-3 ${v.estado === 'fuera_servicio' ? 'border-red-300' : 'border-gray-200'}`}>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg
                  ${v.estado === 'disponible' ? 'bg-green-100' : v.estado === 'en_ruta' ? 'bg-blue-100' : 'bg-red-100'}`}>
                  🚛
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{v.id}</p>
                  <p className="text-xs text-gray-500">{v.tipo}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">⋯</button>
            </div>

            <div className="text-xs text-gray-500 flex flex-col gap-1">
              <div className="flex justify-between gap-2">
                <span>Capacidad</span><span className="font-medium text-gray-700">{v.capacidad}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Kilometraje</span><span className="font-medium text-gray-700">{v.km}</span>
              </div>
            </div>

            {v.conductor && (
              <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                <p>👤 {v.conductor}</p>
                <p>📍 {v.zona}</p>
              </div>
            )}

            {v.estado === 'mantenimiento' && (
              <p className="text-xs text-gray-500">Próxima disponibilidad: {v.disponible}</p>
            )}

            {v.estado === 'fuera_servicio' && (
              <p className="text-xs text-orange-500 bg-orange-50 rounded px-2 py-1">⚠ Requiere Revisión</p>
            )}

            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${estadoBadge[v.estado]}`}>
                {estadoLabel[v.estado]}
              </span>
              {v.estado === 'disponible' && (
                <button className="bg-[#1a7a5e] text-white text-xs px-3 py-1 rounded-lg hover:bg-[#155f49] transition-colors">
                  Asignar
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default AsignarVehiculo