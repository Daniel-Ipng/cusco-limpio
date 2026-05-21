const conductores = [
  { nombre: 'María García', disponible: true },
  { nombre: 'Carlos Mendoza', disponible: true },
  { nombre: 'Juan Lopez', disponible: false },
]

const ayudantes = [
  { nombre: 'María García', disponible: true },
  { nombre: 'María García', disponible: true },
  { nombre: 'María García', disponible: true },
  { nombre: 'María García', disponible: false },
]

const turnos = [
  { label: 'Madrugada', hora: '04:00 - 08:00' },
  { label: 'Mañana', hora: '04:00 - 08:00' },
  { label: 'Tarde', hora: '04:00 - 08:00' },
  { label: 'Noche', hora: '04:00 - 08:00' },
]

function AsignarHorario() {
  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Asignar Horario</h1>
          <p className="text-sm text-gray-500">Recursos › Programación semanal</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1a7a5e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors">
          + Agregar turno
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📅', valor: 24, label: 'Total horarios', sub: 'Horarios activos esta semana' },
          { icon: '👤', valor: 8, label: 'Conductores Activos', sub: 'De 12 registrados' },
          { icon: '🚛', valor: 6, label: 'Vehículos en uso', sub: 'De 10 registrados' },
          { icon: '📋', valor: 3, label: 'Turnos sin cubrir', sub: 'Requieren atención' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.valor}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden w-fit">
        <button className="px-6 py-2 text-sm font-medium bg-white text-gray-800 border-r border-gray-200">
          Crear Horario
        </button>
        <button className="px-6 py-2 text-sm font-medium bg-gray-100 text-gray-500">
          Ver Horarios
        </button>
      </div>

      {/* Contenido */}
      <div className="grid grid-cols-2 gap-6">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-4">

          {/* Zona */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span>🚛</span>
              <p className="font-semibold text-gray-700 text-sm">Zona de recolección</p>
            </div>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-white">
              <option>Seleccionar zona...</option>
              <option>Wanchaq - Zona A</option>
              <option>Santiago - Zona B</option>
              <option>Cusco - Zona C</option>
            </select>
          </div>

          {/* Horarios */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span>🚛</span>
              <p className="font-semibold text-gray-700 text-sm">Horario</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {turnos.map((t, i) => (
                <button key={i} className="border border-gray-200 rounded-lg p-3 text-left hover:border-[#1a7a5e] hover:bg-green-50 transition-colors">
                  <p className="text-xs font-medium text-gray-700">{t.label}</p>
                  <p className="text-xs text-gray-400">{t.hora}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-4">

          {/* Conductores */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span>👤</span>
              <p className="font-semibold text-gray-700 text-sm">Conductor</p>
            </div>
            <div className="flex flex-col gap-2">
              {conductores.map((c, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      {c.nombre.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-gray-700">{c.nombre}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.disponible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ayudantes */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span>👥</span>
                <p className="font-semibold text-gray-700 text-sm">Ayudantes</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">0/2 seleccionados</span>
            </div>
            <div className="flex flex-col gap-2">
              {ayudantes.map((a, i) => (
                <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg ${!a.disponible ? 'opacity-50' : 'hover:bg-gray-50 cursor-pointer'}`}>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" disabled={!a.disponible} className="accent-[#1a7a5e]" />
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      MG
                    </div>
                    <span className="text-sm text-gray-700">{a.nombre}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.disponible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AsignarHorario