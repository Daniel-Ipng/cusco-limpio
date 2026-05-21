import { useEffect, useState } from 'react'
import api from '../lib/axios'

interface Zona { id: string; nombre: string }
interface Conductor { id: string; nombre: string }
interface Vehiculo { id: string; placa: string; tipo: string }
interface Horario { id: string; diaSemana: number; horaInicio: string; horaFin: string; zona: Zona }

const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function AsignarHorario() {
  const [zonas, setZonas] = useState<Zona[]>([])
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [tab, setTab] = useState<'crear' | 'ver'>('crear')
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [zonaId, setZonaId] = useState('')
  const [diaSemana, setDiaSemana] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')
  const [asigZonaId, setAsigZonaId] = useState('')
  const [asigVehiculoId, setAsigVehiculoId] = useState('')
  const [asigConductorId, setAsigConductorId] = useState('')
  const [asigFecha, setAsigFecha] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/zonas'),
      api.get('/usuarios'),
      api.get('/vehiculos/activos'),
      api.get('/horarios/todos'),
    ]).then(([z, u, v, h]) => {
      setZonas(z.data)
      setConductores(u.data.filter((u: any) => u.rol === 'conductor'))
      setVehiculos(v.data)
      setHorarios(h.data)
    }).finally(() => setLoading(false))
  }, [])

  async function crearHorario() {
    if (!zonaId || !diaSemana || !horaInicio || !horaFin) {
      setMensaje('Completa todos los campos')
      return
    }
    setGuardando(true)
    try {
      await api.post('/horarios', {
        zonaId,
        diaSemana: parseInt(diaSemana),
        horaInicio: horaInicio + ':00',
        horaFin: horaFin + ':00',
      })
      setMensaje('✅ Horario creado correctamente')
      setZonaId(''); setDiaSemana(''); setHoraInicio(''); setHoraFin('')
      const res = await api.get('/horarios/todos')
      setHorarios(res.data)
    } catch {
      setMensaje('❌ Error al crear horario')
    } finally {
      setGuardando(false)
    }
  }

  async function crearAsignacion() {
    if (!asigZonaId || !asigVehiculoId || !asigConductorId || !asigFecha) {
      setMensaje('Completa todos los campos de asignación')
      return
    }
    setGuardando(true)
    try {
      await api.post('/asignaciones', {
        zonaId: asigZonaId,
        vehiculoId: asigVehiculoId,
        conductorId: asigConductorId,
        fecha: asigFecha,
      })
      setMensaje('✅ Asignación creada correctamente')
      setAsigZonaId(''); setAsigVehiculoId('')
      setAsigConductorId(''); setAsigFecha('')
    } catch {
      setMensaje('❌ Error al crear asignación')
    } finally {
      setGuardando(false)
    }
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <p className="text-gray-500">Cargando datos...</p>
    </div>
  )

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Asignar Horario</h1>
          <p className="text-sm text-gray-500">Recursos › Programación semanal</p>
        </div>
        <button
          onClick={() => { setTab('crear'); setMensaje('') }}
          className="flex items-center gap-2 bg-[#1a7a5e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors"
        >
          + Agregar turno
        </button>
      </div>

      {/* Stats reales */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📅', valor: horarios.length, label: 'Total horarios', sub: 'Horarios registrados' },
          { icon: '👤', valor: conductores.length, label: 'Conductores activos', sub: 'Disponibles para asignar' },
          { icon: '🚛', valor: vehiculos.length, label: 'Vehículos disponibles', sub: 'Listos para operar' },
          { icon: '📍', valor: zonas.length, label: 'Zonas activas', sub: 'En el distrito de Cusco' },
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
          onClick={() => { setTab('crear'); setMensaje('') }}
          className={`px-6 py-2 text-sm font-medium border-r border-gray-200 transition-colors ${
            tab === 'crear' ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Crear Horario
        </button>
        <button
          onClick={() => { setTab('ver'); setMensaje('') }}
          className={`px-6 py-2 text-sm font-medium transition-colors ${
            tab === 'ver' ? 'bg-white text-gray-800' : 'bg-gray-100 text-gray-500'
          }`}
        >
          Ver Horarios
        </button>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <p className={`mb-4 text-sm px-4 py-2 rounded-lg w-fit ${
          mensaje.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
        }`}>
          {mensaje}
        </p>
      )}

      {/* Tab Crear */}
      {tab === 'crear' && (
        <div className="grid grid-cols-2 gap-6">

          {/* Crear horario semanal */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span>📅</span>
                <p className="font-semibold text-gray-700 text-sm">Zona de recolección</p>
              </div>
              <select
                value={zonaId}
                onChange={e => setZonaId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-white"
              >
                <option value="">Seleccionar zona...</option>
                {zonas.map(z => (
                  <option key={z.id} value={z.id}>{z.nombre}</option>
                ))}
              </select>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span>🕐</span>
                <p className="font-semibold text-gray-700 text-sm">Día y horario</p>
              </div>
              <select
                value={diaSemana}
                onChange={e => setDiaSemana(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
              >
                <option value="">Seleccionar día...</option>
                {dias.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Hora inicio</label>
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={e => setHoraInicio(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Hora fin</label>
                  <input
                    type="time"
                    value={horaFin}
                    onChange={e => setHoraFin(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={crearHorario}
              disabled={guardando}
              className="bg-[#1a7a5e] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : 'Crear horario'}
            </button>
          </div>

          {/* Crear asignación diaria */}
          <div className="flex flex-col gap-4">

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span>👤</span>
                <p className="font-semibold text-gray-700 text-sm">Conductor</p>
              </div>
              <div className="flex flex-col gap-2">
                {conductores.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setAsigConductorId(c.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      asigConductorId === c.id
                        ? 'bg-green-50 border border-[#1a7a5e]'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                        {c.nombre.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-700">{c.nombre}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                      Disponible
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span>🚛</span>
                <p className="font-semibold text-gray-700 text-sm">Vehículo y zona</p>
              </div>
              <select
                value={asigZonaId}
                onChange={e => setAsigZonaId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
              >
                <option value="">Seleccionar zona...</option>
                {zonas.map(z => (
                  <option key={z.id} value={z.id}>{z.nombre}</option>
                ))}
              </select>
              <select
                value={asigVehiculoId}
                onChange={e => setAsigVehiculoId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
              >
                <option value="">Seleccionar vehículo...</option>
                {vehiculos.map(v => (
                  <option key={v.id} value={v.id}>{v.placa} — {v.tipo}</option>
                ))}
              </select>
              <input
                type="date"
                value={asigFecha}
                onChange={e => setAsigFecha(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={crearAsignacion}
              disabled={guardando}
              className="bg-[#1a7a5e] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : 'Crear asignación'}
            </button>
          </div>
        </div>
      )}

      {/* Tab Ver Horarios */}
      {tab === 'ver' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Zona</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Día</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Hora inicio</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Hora fin</th>
              </tr>
            </thead>
            <tbody>
              {horarios.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    No hay horarios registrados
                  </td>
                </tr>
              ) : (
                horarios.map((h, i) => (
                  <tr key={h.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-gray-700">{h.zona?.nombre ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{dias[h.diaSemana]}</td>
                    <td className="px-4 py-3 text-gray-700">{h.horaInicio}</td>
                    <td className="px-4 py-3 text-gray-700">{h.horaFin}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}