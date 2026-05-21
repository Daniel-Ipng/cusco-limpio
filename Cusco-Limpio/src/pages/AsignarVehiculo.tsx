import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Vehiculo = {
  id: number
  placa: string
  tipo: string
  capacidad: string | null
  km: number | string | null
  estado: string
  conductor: string | null
  zona: string | null
}

const API_BASE = 'http://localhost:3000/api'

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

function formatKm(kmValue: number | string | null) {
  if (kmValue === null || kmValue === undefined) {
    return '0 km'
  }

  const numeric = typeof kmValue === 'string' ? Number(kmValue) : kmValue
  if (Number.isNaN(numeric)) {
    return `${kmValue} km`
  }

  return `${new Intl.NumberFormat('es-PE').format(numeric)} km`
}

function AsignarVehiculo() {
  const navigate = useNavigate()
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [cargandoId, setCargandoId] = useState<number | null>(null)

  const stats = useMemo(() => {
    const total = vehiculos.length
    const disponibles = vehiculos.filter(v => v.estado === 'disponible').length
    const enRuta = vehiculos.filter(v => v.estado === 'en_ruta').length
    const noOperativos = vehiculos.filter(v => v.estado === 'mantenimiento' || v.estado === 'fuera_servicio').length

    return { total, disponibles, enRuta, noOperativos }
  }, [vehiculos])

  useEffect(() => {
    void cargarVehiculos()
  }, [])

  async function cargarVehiculos() {
    try {
      const response = await fetch(`${API_BASE}/vehiculos`)
      if (!response.ok) {
        throw new Error('Error de vehiculos')
      }
      setVehiculos(await response.json())
    } catch (error) {
      window.alert('No se pudieron cargar los vehiculos')
    }
  }

  async function handleAsignar(vehiculoId: number) {
    setCargandoId(vehiculoId)
    try {
      const response = await fetch(`${API_BASE}/vehiculos/${vehiculoId}/asignar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'No se pudo asignar')
      }

      await cargarVehiculos()
      window.alert('Vehiculo asignado')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo asignar'
      window.alert(message)
    } finally {
      setCargandoId(null)
    }
  }

  function handleDetalle(vehiculo: Vehiculo) {
    const detalle = [
      `Placa: ${vehiculo.placa}`,
      `Tipo: ${vehiculo.tipo}`,
      `Capacidad: ${vehiculo.capacidad || 'Sin dato'}`,
      `Kilometraje: ${formatKm(vehiculo.km)}`,
      `Estado: ${estadoLabel[vehiculo.estado] || vehiculo.estado}`,
    ].join('\n')

    window.alert(detalle)
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Asignar Vehículo</h1>
          <p className="text-sm text-gray-500">Gestión de la flota de vehículos</p>
        </div>
        <button
          onClick={() => navigate('/admin/horarios')}
          className="flex items-center gap-2 bg-[#1a7a5e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors"
        >
          + Agregar turno
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { icon: '🚛', valor: stats.total, label: 'Total flota' },
          { icon: '✅', valor: stats.disponibles, label: 'Disponibles' },
          { icon: '🚚', valor: stats.enRuta, label: 'En ruta' },
          { icon: '⚠️', valor: stats.noOperativos, label: 'No operativos' },
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
        {vehiculos.length === 0 && (
          <p className="text-sm text-gray-500">No hay vehículos registrados</p>
        )}
        {vehiculos.map((v) => (
          <div key={v.id} className={`bg-white border rounded-xl p-4 flex flex-col gap-3 ${v.estado === 'fuera_servicio' ? 'border-red-300' : 'border-gray-200'}`}>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg
                  ${v.estado === 'disponible' ? 'bg-green-100' : v.estado === 'en_ruta' ? 'bg-blue-100' : 'bg-red-100'}`}>
                  🚛
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{v.placa}</p>
                  <p className="text-xs text-gray-500">{v.tipo}</p>
                </div>
              </div>
              <button
                onClick={() => handleDetalle(v)}
                className="text-gray-400 hover:text-gray-600"
              >
                ⋯
              </button>
            </div>

            <div className="text-xs text-gray-500 flex flex-col gap-1">
              <div className="flex justify-between gap-2">
                <span>Capacidad</span><span className="font-medium text-gray-700">{v.capacidad || 'Sin dato'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Kilometraje</span><span className="font-medium text-gray-700">{formatKm(v.km)}</span>
              </div>
            </div>

            {v.conductor && (
              <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                <p>👤 {v.conductor}</p>
                <p>📍 {v.zona}</p>
              </div>
            )}

            {v.estado === 'mantenimiento' && (
              <p className="text-xs text-gray-500">En mantenimiento</p>
            )}

            {v.estado === 'fuera_servicio' && (
              <p className="text-xs text-orange-500 bg-orange-50 rounded px-2 py-1">⚠ Requiere Revisión</p>
            )}

            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${estadoBadge[v.estado]}`}>
                {estadoLabel[v.estado]}
              </span>
              {v.estado === 'disponible' && (
                <button
                  onClick={() => handleAsignar(v.id)}
                  disabled={cargandoId === v.id}
                  className="bg-[#1a7a5e] text-white text-xs px-3 py-1 rounded-lg hover:bg-[#155f49] transition-colors disabled:opacity-60"
                >
                  {cargandoId === v.id ? 'Asignando...' : 'Asignar'}
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