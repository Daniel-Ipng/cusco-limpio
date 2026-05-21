import { useEffect, useMemo, useState } from 'react'

type Zona = {
  id: number
  nombre: string
}

type Horario = {
  id: number
  turno: string
  hora_inicio: string
  hora_fin: string
  dias: string
}

type Conductor = {
  id: number
  nombre: string
  disponible: boolean
}

type Ayudante = {
  id: number
  nombre: string
  disponible: boolean
}

type Programacion = {
  id: number
  zona: string
  turno: string
  hora_inicio: string
  hora_fin: string
  dias: string
  conductor: string | null
  vehiculo: string | null
  ayudantes: { id: number; nombre: string }[]
}

type VehiculoStats = {
  estado: string
}

const API_BASE = 'http://localhost:3000/api'

function formatHora(hora: string) {
  return hora.slice(0, 5)
}

function AsignarHorario() {
  const [tab, setTab] = useState<'crear' | 'ver'>('crear')
  const [zonas, setZonas] = useState<Zona[]>([])
  const [zonaId, setZonaId] = useState('')
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [horarioId, setHorarioId] = useState<number | null>(null)
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [conductorId, setConductorId] = useState<number | null>(null)
  const [ayudantes, setAyudantes] = useState<Ayudante[]>([])
  const [ayudanteIds, setAyudanteIds] = useState<number[]>([])
  const [programaciones, setProgramaciones] = useState<Programacion[]>([])
  const [vehiculos, setVehiculos] = useState<VehiculoStats[]>([])
  const [guardando, setGuardando] = useState(false)

  const resumen = useMemo(() => {
    const totalHorarios = programaciones.length
    const conductoresActivos = conductores.filter(c => c.disponible).length
    const totalConductores = conductores.length
    const vehiculosEnUso = vehiculos.filter(v => v.estado === 'en_ruta').length
    const totalVehiculos = vehiculos.length
    const turnosSinCubrir = programaciones.filter(p => !p.vehiculo).length

    return {
      totalHorarios,
      conductoresActivos,
      totalConductores,
      vehiculosEnUso,
      totalVehiculos,
      turnosSinCubrir,
    }
  }, [programaciones, conductores, vehiculos])

  useEffect(() => {
    async function cargarBase() {
      try {
        const [zonasRes, conductoresRes, ayudantesRes, programacionesRes, vehiculosRes] = await Promise.all([
          fetch(`${API_BASE}/zonas`),
          fetch(`${API_BASE}/conductores`),
          fetch(`${API_BASE}/ayudantes`),
          fetch(`${API_BASE}/programaciones`),
          fetch(`${API_BASE}/vehiculos`),
        ])

        if (!zonasRes.ok || !conductoresRes.ok || !ayudantesRes.ok || !programacionesRes.ok || !vehiculosRes.ok) {
          throw new Error('No se pudo cargar la informacion')
        }

        setZonas(await zonasRes.json())
        setConductores(await conductoresRes.json())
        setAyudantes(await ayudantesRes.json())
        setProgramaciones(await programacionesRes.json())
        setVehiculos(await vehiculosRes.json())
      } catch (error) {
        window.alert('No se pudo cargar la informacion administrativa')
      }
    }

    void cargarBase()
  }, [])

  useEffect(() => {
    async function cargarHorarios() {
      if (!zonaId) {
        setHorarios([])
        setHorarioId(null)
        return
      }

      try {
        const response = await fetch(`${API_BASE}/horarios/zona/${zonaId}`)
        if (!response.ok) {
          throw new Error('Error de horarios')
        }
        setHorarios(await response.json())
      } catch (error) {
        window.alert('No se pudieron cargar los horarios')
      }
    }

    void cargarHorarios()
  }, [zonaId])

  async function refrescarProgramaciones() {
    try {
      const response = await fetch(`${API_BASE}/programaciones`)
      if (!response.ok) {
        throw new Error('Error de programaciones')
      }
      setProgramaciones(await response.json())
    } catch (error) {
      window.alert('No se pudieron actualizar las programaciones')
    }
  }

  function toggleAyudante(id: number) {
    setAyudanteIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id)
      }

      if (prev.length >= 2) {
        return prev
      }

      return [...prev, id]
    })
  }

  async function handleAgregarTurno() {
    if (!zonaId || !horarioId || !conductorId) {
      window.alert('Completa zona, horario y conductor')
      return
    }

    setGuardando(true)
    try {
      const response = await fetch(`${API_BASE}/programaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          horarioId,
          conductorId,
          ayudanteIds,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al guardar')
      }

      await refrescarProgramaciones()
      setConductorId(null)
      setAyudanteIds([])
      setHorarioId(null)
      window.alert('Turno agregado')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al guardar'
      window.alert(message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Asignar Horario</h1>
          <p className="text-sm text-gray-500">Recursos › Programación semanal</p>
        </div>
        <button
          onClick={handleAgregarTurno}
          disabled={tab !== 'crear' || guardando}
          className="flex items-center gap-2 bg-[#1a7a5e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors disabled:opacity-60"
        >
          {guardando ? 'Guardando...' : '+ Agregar turno'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📅', valor: resumen.totalHorarios, label: 'Total horarios', sub: 'Horarios activos esta semana' },
          { icon: '👤', valor: resumen.conductoresActivos, label: 'Conductores Activos', sub: `De ${resumen.totalConductores} registrados` },
          { icon: '🚛', valor: resumen.vehiculosEnUso, label: 'Vehículos en uso', sub: `De ${resumen.totalVehiculos} registrados` },
          { icon: '📋', valor: resumen.turnosSinCubrir, label: 'Turnos sin cubrir', sub: 'Requieren atención' },
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
        <button
          onClick={() => setTab('crear')}
          className={`px-6 py-2 text-sm font-medium border-r border-gray-200 ${
            tab === 'crear' ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Crear Horario
        </button>
        <button
          onClick={() => setTab('ver')}
          className={`px-6 py-2 text-sm font-medium ${
            tab === 'ver' ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Ver Horarios
        </button>
      </div>

      {/* Contenido */}
      {tab === 'crear' ? (
      <div className="grid grid-cols-2 gap-6">

        {/* Columna izquierda */}
        <div className="flex flex-col gap-4">

          {/* Zona */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span>🚛</span>
              <p className="font-semibold text-gray-700 text-sm">Zona de recolección</p>
            </div>
            <select
              value={zonaId}
              onChange={e => setZonaId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-white"
            >
              <option value="">Seleccionar zona...</option>
              {zonas.map(zona => (
                <option key={zona.id} value={zona.id}>{zona.nombre}</option>
              ))}
            </select>
          </div>

          {/* Horarios */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span>🚛</span>
              <p className="font-semibold text-gray-700 text-sm">Horario</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {horarios.length === 0 && (
                <p className="text-xs text-gray-400">Selecciona una zona para ver horarios</p>
              )}
              {horarios.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setHorarioId(t.id)}
                  className={`border rounded-lg p-3 text-left transition-colors ${
                    horarioId === t.id
                      ? 'border-[#1a7a5e] bg-green-50'
                      : 'border-gray-200 hover:border-[#1a7a5e] hover:bg-green-50'
                  }`}
                >
                  <p className="text-xs font-medium text-gray-700">{t.turno}</p>
                  <p className="text-xs text-gray-400">{formatHora(t.hora_inicio)} - {formatHora(t.hora_fin)}</p>
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
              {conductores.map((c) => (
                <div
                  key={c.id}
                  onClick={() => c.disponible && setConductorId(c.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                    c.disponible ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-60'
                  } ${conductorId === c.id ? 'bg-green-50' : ''}`}
                >
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
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{ayudanteIds.length}/2 seleccionados</span>
            </div>
            <div className="flex flex-col gap-2">
              {ayudantes.map((a) => (
                <div key={a.id} className={`flex items-center justify-between px-3 py-2 rounded-lg ${!a.disponible ? 'opacity-50' : 'hover:bg-gray-50 cursor-pointer'}`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={ayudanteIds.includes(a.id)}
                      onChange={() => a.disponible && toggleAyudante(a.id)}
                      disabled={!a.disponible}
                      className="accent-[#1a7a5e]"
                    />
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      {a.nombre.split(' ').map(n => n[0]).join('')}
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
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Programaciones registradas</h2>
          <div className="flex flex-col gap-3">
            {programaciones.length === 0 && (
              <p className="text-xs text-gray-400">No hay programaciones registradas</p>
            )}
            {programaciones.map(p => (
              <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">{p.zona}</p>
                  <span className="text-xs text-gray-500">{p.turno}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{p.dias}</p>
                <p className="text-xs text-gray-500">{formatHora(p.hora_inicio)} - {formatHora(p.hora_fin)}</p>
                <div className="mt-2 text-xs text-gray-600 flex flex-col gap-1">
                  <span>👤 {p.conductor || 'Sin conductor'}</span>
                  <span>👥 {p.ayudantes.length > 0 ? p.ayudantes.map(a => a.nombre).join(', ') : 'Sin ayudantes'}</span>
                  <span>🚛 {p.vehiculo || 'Sin vehículo'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AsignarHorario