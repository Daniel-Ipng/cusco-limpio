import { useEffect, useMemo, useState } from 'react'

type Zona = {
  id: number
  nombre: string
}

type Ruta = {
  id: number
  nombre: string
  descripcion: string | null
  distancia_km: number | null
  tiempo_estimado_min: number | null
  zona: string | null
}

type Vehiculo = {
  id: number
  estado: string
}

const API_BASE = 'http://localhost:3000/api'

function formatDistancia(distancia: number | null) {
  if (!distancia) {
    return '0 km'
  }
  return `${distancia.toFixed(1)} km`
}

function formatTiempoTotal(minutos: number) {
  if (!minutos) {
    return '0 min'
  }

  const horas = Math.floor(minutos / 60)
  const restante = minutos % 60

  if (horas === 0) {
    return `${restante} min`
  }

  return `${horas}h ${restante} min`
}

function AsignarZona() {
  const [zonas, setZonas] = useState<Zona[]>([])
  const [rutas, setRutas] = useState<Ruta[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [zonaActivaId, setZonaActivaId] = useState<number | null>(null)

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [zonasRes, rutasRes, vehiculosRes] = await Promise.all([
          fetch(`${API_BASE}/zonas`),
          fetch(`${API_BASE}/rutas`),
          fetch(`${API_BASE}/vehiculos`),
        ])

        if (!zonasRes.ok || !rutasRes.ok || !vehiculosRes.ok) {
          throw new Error('Error de datos')
        }

        setZonas(await zonasRes.json())
        setRutas(await rutasRes.json())
        setVehiculos(await vehiculosRes.json())
      } catch (error) {
        window.alert('No se pudieron cargar los datos de zonas')
      }
    }

    void cargarDatos()
  }, [])

  useEffect(() => {
    if (zonas.length > 0 && zonaActivaId === null) {
      setZonaActivaId(zonas[0].id)
    }
  }, [zonas, zonaActivaId])

  const zonaActiva = useMemo(() => {
    if (zonas.length === 0) {
      return null
    }
    return zonas.find(zona => zona.id === zonaActivaId) ?? zonas[0]
  }, [zonas, zonaActivaId])

  const rutasZona = useMemo(() => {
    if (!zonaActiva) {
      return []
    }
    const zonaNombre = zonaActiva.nombre.toLowerCase()
    return rutas.filter(ruta => (ruta.zona || '').toLowerCase() === zonaNombre)
  }, [rutas, zonaActiva])

  const rutasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) {
      return rutasZona
    }
    return rutasZona.filter(ruta => {
      const nombre = ruta.nombre.toLowerCase()
      const descripcion = (ruta.descripcion || '').toLowerCase()
      return nombre.includes(termino) || descripcion.includes(termino)
    })
  }, [rutasZona, busqueda])

  const estadisticas = useMemo(() => {
    const zonasActivas = zonas.length
    const rutasTotales = rutas.length
    const enRuta = vehiculos.filter(vehiculo => vehiculo.estado === 'en_ruta').length
    const noOperativos = vehiculos.filter(vehiculo => vehiculo.estado === 'mantenimiento' || vehiculo.estado === 'fuera_servicio').length

    return {
      zonasActivas,
      rutasTotales,
      enRuta,
      noOperativos,
    }
  }, [zonas, rutas, vehiculos])

  const distanciaTotal = useMemo(() => {
    return rutasZona.reduce((total, ruta) => total + (ruta.distancia_km || 0), 0)
  }, [rutasZona])

  const tiempoTotal = useMemo(() => {
    return rutasZona.reduce((total, ruta) => total + (ruta.tiempo_estimado_min || 0), 0)
  }, [rutasZona])

  return (
    <div className="zone-page min-h-screen px-8 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs zone-muted uppercase tracking-[0.2em]">Panel municipal</p>
          <h1 className="zone-title text-3xl text-gray-900">Asignar zona</h1>
          <p className="text-sm zone-muted">Gestion de zonas y rutas activas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar ruta..."
              className="zone-input w-64 rounded-full px-4 py-2 text-sm focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="zone-icon-btn"
            aria-label="Opciones"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {
          [
            { valor: estadisticas.zonasActivas, label: 'Zonas activas' },
            { valor: estadisticas.rutasTotales, label: 'Rutas totales' },
            { valor: estadisticas.enRuta, label: 'En ruta' },
            { valor: estadisticas.noOperativos, label: 'No operativos' },
          ].map((stat, index) => (
            <div key={index} className="zone-stat rounded-2xl p-4">
              <p className="text-2xl font-semibold text-gray-900">{stat.valor}</p>
              <p className="text-xs zone-muted">{stat.label}</p>
            </div>
          ))
        }
      </div>

      <div className="zone-card rounded-2xl p-6">
        {!zonaActiva ? (
          <p className="text-sm zone-muted">No hay zonas registradas</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="zone-dot" />
                <h2 className="text-lg font-semibold text-gray-900">{zonaActiva.nombre}</h2>
                {rutasZona.length > 0 && (
                  <span className="zone-pill">Optimizada</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {zonas.map(zona => (
                  <button
                    key={zona.id}
                    onClick={() => setZonaActivaId(zona.id)}
                    className={`zone-chip ${zona.id === zonaActiva.id ? 'zone-chip-active' : ''}`}
                  >
                    {zona.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="zone-mini-card">
                <p className="text-xl font-semibold text-gray-900">{rutasZona.length}</p>
                <p className="text-xs zone-muted">Rutas</p>
              </div>
              <div className="zone-mini-card">
                <p className="text-xl font-semibold text-gray-900">{formatDistancia(distanciaTotal)}</p>
                <p className="text-xs zone-muted">Distancia total</p>
              </div>
              <div className="zone-mini-card">
                <p className="text-xl font-semibold text-gray-900">{formatTiempoTotal(tiempoTotal)}</p>
                <p className="text-xs zone-muted">Tiempo est.</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800">Rutas</h3>
              <div className="mt-3 flex flex-col gap-2">
                {rutasFiltradas.length === 0 ? (
                  <p className="text-sm zone-muted">No hay rutas para esta zona</p>
                ) : (
                  rutasFiltradas.map(ruta => (
                    <div key={ruta.id} className="zone-route">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ruta.nombre}</p>
                        <p className="text-xs zone-muted">{ruta.descripcion || 'Sin descripcion'}</p>
                      </div>
                      <span className="text-xs zone-muted">
                        {formatTiempoTotal(ruta.tiempo_estimado_min || 0)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="zone-action" disabled>
                + Nueva ruta
              </button>
              <button type="button" className="zone-action" disabled>
                Agregar punto
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AsignarZona
