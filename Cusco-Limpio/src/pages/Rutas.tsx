import { useState } from 'react'

// Tipos
interface Ruta {
  id: string
  nombre: string
  puntos: number
  minutos: number
  activa: boolean
}

interface Zona {
  id: string
  nombre: string
  estado: 'Optimizada' | 'En progreso' | 'Pendiente'
  totalRutas: number
  totalPuntos: number
  tiempoEstimadoMin: number
  rutas: Ruta[]
}

// Datos de ejemplo
const zonasData: Zona[] = [
  {
    id: 'wanchaq',
    nombre: 'Wanchaq',
    estado: 'Optimizada',
    totalRutas: 5,
    totalPuntos: 48,
    tiempoEstimadoMin: 200,
    rutas: [
      { id: '1', nombre: 'Ruta zona A - 1', puntos: 12, minutos: 45, activa: true },
      { id: '2', nombre: 'Ruta zona A - 1', puntos: 15, minutos: 52, activa: true },
      { id: '3', nombre: 'Ruta zona A - 1', puntos: 10, minutos: 38, activa: true },
      { id: '4', nombre: 'Ruta zona A - 1', puntos: 13, minutos: 42, activa: true },
    ],
  },
  {
    id: 'san-sebastian',
    nombre: 'San Sebastián',
    estado: 'En progreso',
    totalRutas: 4,
    totalPuntos: 35,
    tiempoEstimadoMin: 155,
    rutas: [
      { id: '5', nombre: 'Ruta zona B - 1', puntos: 9, minutos: 40, activa: true },
      { id: '6', nombre: 'Ruta zona B - 2', puntos: 11, minutos: 48, activa: true },
      { id: '7', nombre: 'Ruta zona B - 3', puntos: 8, minutos: 32, activa: false },
      { id: '8', nombre: 'Ruta zona B - 4', puntos: 7, minutos: 35, activa: true },
    ],
  },
  {
    id: 'santiago',
    nombre: 'Santiago',
    estado: 'Pendiente',
    totalRutas: 3,
    totalPuntos: 22,
    tiempoEstimadoMin: 110,
    rutas: [
      { id: '9', nombre: 'Ruta zona C - 1', puntos: 8, minutos: 36, activa: false },
      { id: '10', nombre: 'Ruta zona C - 2', puntos: 7, minutos: 38, activa: false },
      { id: '11', nombre: 'Ruta zona C - 3', puntos: 7, minutos: 36, activa: false },
    ],
  },
]

// Badge de estado de zona
function EstadoBadge({ estado }: { estado: Zona['estado'] }) {
  const colores = {
    Optimizada: 'bg-green-100 text-green-700',
    'En progreso': 'bg-yellow-100 text-yellow-700',
    Pendiente: 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colores[estado]}`}>
      {estado}
    </span>
  )
}

// Punto de color del indicador de zona
function PuntoZona({ estado }: { estado: Zona['estado'] }) {
  const colores = {
    Optimizada: 'bg-green-500',
    'En progreso': 'bg-yellow-400',
    Pendiente: 'bg-gray-400',
  }
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colores[estado]}`} />
}

// Formatea minutos a "Xh Ymin"
function formatTiempo(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m} min`
}

// Tarjeta de métrica superior
function MetricCard({
  valor,
  label,
  icono,
  color,
}: {
  valor: number
  label: string
  icono: string
  color: 'green' | 'teal' | 'orange' | 'red'
}) {
  const colores = {
    green: 'bg-green-50 text-green-600',
    teal: 'bg-teal-50 text-teal-600',
    orange: 'bg-orange-50 text-orange-500',
    red: 'bg-red-50 text-red-500',
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4 min-w-[130px] flex-1">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${colores[color]}`}>
        {icono}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 leading-tight">{valor}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  )
}

// Modal para nueva ruta
function ModalNuevaRuta({
  zonaId,
  onClose,
  onCrear,
}: {
  zonaId: string
  onClose: () => void
  onCrear: (nombre: string, puntos: number, minutos: number) => void
}) {
  const [nombre, setNombre] = useState('')
  const [puntos, setPuntos] = useState('')
  const [minutos, setMinutos] = useState('')

  const handleSubmit = () => {
    if (!nombre || !puntos || !minutos) return
    onCrear(nombre, parseInt(puntos), parseInt(minutos))
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Nueva ruta</h3>
        <div className="flex flex-col gap-3">
          <input
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a7a5e]"
            placeholder="Nombre de la ruta"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a7a5e]"
            placeholder="Cantidad de puntos"
            type="number"
            value={puntos}
            onChange={(e) => setPuntos(e.target.value)}
          />
          <input
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a7a5e]"
            placeholder="Tiempo estimado (min)"
            type="number"
            value={minutos}
            onChange={(e) => setMinutos(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-lg bg-[#1a7a5e] text-white text-sm font-medium hover:bg-[#155f49] transition-colors"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  )
}

// Panel de una zona
function ZonaPanel({
  zona,
  onNuevaRuta,
}: {
  zona: Zona
  onNuevaRuta: (zonaId: string) => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* Header zona */}
      <div className="flex items-center gap-2 mb-4">
        <PuntoZona estado={zona.estado} />
        <span className="font-semibold text-gray-800 text-sm">{zona.nombre}</span>
        <EstadoBadge estado={zona.estado} />
      </div>

      {/* Stats de zona */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-gray-800">{zona.totalRutas}</p>
          <p className="text-xs text-gray-500 mt-0.5">Rutas</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-gray-800">{zona.totalPuntos}</p>
          <p className="text-xs text-gray-500 mt-0.5">Puntos</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-sm font-bold text-gray-800">{formatTiempo(zona.tiempoEstimadoMin)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Tiempo est.</p>
        </div>
      </div>

      {/* Lista de rutas */}
      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Rutas</p>
      <div className="flex flex-col gap-1.5">
        {zona.rutas.map((ruta) => (
          <div
            key={ruta.id}
            className="flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="text-[#1a7a5e] text-base">✓</span>
            <div className="flex-1">
              <p className="text-sm text-gray-700">{ruta.nombre}</p>
              <p className="text-xs text-gray-400">
                {ruta.puntos} puntos · {ruta.minutos} min
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onNuevaRuta(zona.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="text-base font-light">+</span> Nueva ruta
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          📍 Agregar punto
        </button>
      </div>
    </div>
  )
}

// Mapa placeholder
function MapaZonas() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col h-full min-h-[320px]">
      <p className="text-sm font-semibold text-gray-700 mb-3">Mapa de zonas</p>
      <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-sm text-gray-400">Vista del mapa próximamente</p>
          <p className="text-xs text-gray-300 mt-1">Integración con Google Maps / OpenStreetMap</p>
        </div>
      </div>
    </div>
  )
}

// Componente principal
function Rutas() {
  const [zonas, setZonas] = useState<Zona[]>(zonasData)
  const [busqueda, setBusqueda] = useState('')
  const [modalZonaId, setModalZonaId] = useState<string | null>(null)
  const [distritoSeleccionado, setDistritoSeleccionado] = useState<string>('wanchaq')

  const totalZonas = zonas.length
  const totalRutas = zonas.reduce((acc, z) => acc + z.totalRutas, 0)
  const enRuta = 15 // dato simulado
  const noOperativos = 2 // dato simulado

  const zonasFiltradas = zonas.filter((z) =>
    z.id === distritoSeleccionado &&
    z.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleNuevaRuta = (zonaId: string, nombre: string, puntos: number, minutos: number) => {
    setZonas((prev) =>
      prev.map((z) => {
        if (z.id !== zonaId) return z
        const nuevaRuta: Ruta = {
          id: Date.now().toString(),
          nombre,
          puntos,
          minutos,
          activa: true,
        }
        return {
          ...z,
          rutas: [...z.rutas, nuevaRuta],
          totalRutas: z.totalRutas + 1,
          totalPuntos: z.totalPuntos + puntos,
          tiempoEstimadoMin: z.tiempoEstimadoMin + minutos,
        }
      })
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Modal */}
      {modalZonaId && (
        <ModalNuevaRuta
          zonaId={modalZonaId}
          onClose={() => setModalZonaId(null)}
          onCrear={(nombre, puntos, minutos) => {
            handleNuevaRuta(modalZonaId, nombre, puntos, minutos)
          }}
        />
      )}

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rutas</h1>
          <p className="text-sm text-gray-500">Gestión de rutas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-[#1a7a5e] w-52 transition-colors"
              placeholder="Buscar ruta..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button className="w-9 h-9 border border-gray-200 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 text-sm">
            ⋮
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="flex gap-3 flex-wrap">
        <MetricCard valor={totalZonas} label="Zonas Activas" icono="📍" color="green" />
        <MetricCard valor={totalRutas} label="Rutas totales" icono="🗺️" color="teal" />
        <MetricCard valor={enRuta} label="En ruta" icono="🚛" color="orange" />
        <MetricCard valor={noOperativos} label="No operativos" icono="⚠️" color="red" />
      </div>

      {/* Selector de distrito */}
      <div>
        <select
          value={distritoSeleccionado}
          onChange={(e) => setDistritoSeleccionado(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white outline-none focus:border-[#1a7a5e] cursor-pointer appearance-none pr-8"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
        >
          <option value="" disabled>Seleccionar distrito:</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.id}>{z.nombre}</option>
          ))}
        </select>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Columna izquierda: paneles de zonas */}
        <div className="flex flex-col gap-4">
          {zonasFiltradas.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
              No se encontraron zonas con ese nombre.
            </div>
          ) : (
            zonasFiltradas.map((zona) => (
              <ZonaPanel
                key={zona.id}
                zona={zona}
                onNuevaRuta={(id) => setModalZonaId(id)}
              />
            ))
          )}
        </div>

        {/* Columna derecha: mapa */}
        <div className="sticky top-6 self-start">
          <MapaZonas />
        </div>
      </div>
    </div>
  )
}

export default Rutas
