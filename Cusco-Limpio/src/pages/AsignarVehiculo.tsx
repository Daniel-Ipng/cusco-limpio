import { useEffect, useState } from 'react'
import api from '../lib/axios'

interface Vehiculo {
  id: string
  placa: string
  tipo: 'compactador' | 'volquete' | 'motofurgon'
  estado: 'activo' | 'mantenimiento'
}

const estadoBadge: Record<string, string> = {
  activo: 'bg-green-100 text-green-700',
  mantenimiento: 'bg-gray-100 text-gray-600',
}

const estadoLabel: Record<string, string> = {
  activo: 'Disponible',
  mantenimiento: 'En Mantenimiento',
}

const tipoLabel: Record<string, string> = {
  compactador: 'Compactador',
  volquete: 'Volquete',
  motofurgon: 'Motofurgón',
}

export default function AsignarVehiculo() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/vehiculos')
      .then(res => setVehiculos(res.data))
      .catch(() => setError('Error al cargar vehículos'))
      .finally(() => setLoading(false))
  }, [])

  // Estadísticas calculadas desde los datos reales
  const total = vehiculos.length
  const disponibles = vehiculos.filter(v => v.estado === 'activo').length
  const enMantenimiento = vehiculos.filter(v => v.estado === 'mantenimiento').length

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <p className="text-gray-500">Cargando vehículos...</p>
    </div>
  )

  if (error) return (
    <div className="p-8">
      <p className="text-red-500">{error}</p>
    </div>
  )

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Asignar Vehículo</h1>
          <p className="text-sm text-gray-500">Gestión de la flota de vehículos</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1a7a5e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#155f49] transition-colors">
          + Agregar vehículo
        </button>
      </div>

      {/* Stats reales */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <span className="text-2xl">🚛</span>
          <div>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
            <p className="text-xs text-gray-500">Total flota</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-2xl font-bold text-gray-800">{disponibles}</p>
            <p className="text-xs text-gray-500">Disponibles</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-2xl font-bold text-gray-800">{enMantenimiento}</p>
            <p className="text-xs text-gray-500">En mantenimiento</p>
          </div>
        </div>
      </div>

      {/* Flota */}
      <h2 className="text-base font-semibold text-gray-700 mb-4">
        Flota de vehículos
      </h2>

      {vehiculos.length === 0 ? (
        <p className="text-gray-400 text-sm">No hay vehículos registrados.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {vehiculos.map((v) => (
            <div
              key={v.id}
              className={`bg-white border rounded-xl p-4 flex flex-col gap-3 ${
                v.estado === 'mantenimiento' ? 'border-orange-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
                    v.estado === 'activo' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    🚛
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{v.placa}</p>
                    <p className="text-xs text-gray-500">{tipoLabel[v.tipo]}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${estadoBadge[v.estado]}`}>
                  {estadoLabel[v.estado]}
                </span>
                {v.estado === 'activo' && (
                  <button className="bg-[#1a7a5e] text-white text-xs px-3 py-1 rounded-lg hover:bg-[#155f49] transition-colors">
                    Asignar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}