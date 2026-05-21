import { useEffect, useState } from 'react'

type VehiculoRuta = {
  id: number
  placa: string
  tipo: string
  km: number | string | null
  conductor: string | null
  zona: string | null
}

const API_BASE = 'http://localhost:3000/api'

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

function CamionesEnRuta() {
  const [vehiculos, setVehiculos] = useState<VehiculoRuta[]>([])

  useEffect(() => {
    async function cargarCamiones() {
      try {
        const response = await fetch(`${API_BASE}/vehiculos?estado=en_ruta`)
        if (!response.ok) {
          throw new Error('Error de camiones')
        }
        setVehiculos(await response.json())
      } catch (error) {
        window.alert('No se pudieron cargar los camiones en ruta')
      }
    }

    void cargarCamiones()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Camiones en Ruta</h1>
        <p className="text-sm text-gray-500">Seguimiento de vehículos activos</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        {vehiculos.length === 0 ? (
          <p className="text-sm text-gray-500">No hay camiones en ruta</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {vehiculos.map(vehiculo => (
              <div key={vehiculo.id} className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-800">{vehiculo.placa}</p>
                <p className="text-xs text-gray-500">{vehiculo.tipo}</p>
                <div className="text-xs text-gray-600 flex flex-col gap-1 mt-2">
                  <span>Conductor: {vehiculo.conductor || 'Sin conductor'}</span>
                  <span>Zona: {vehiculo.zona || 'Sin zona'}</span>
                  <span>Kilometraje: {formatKm(vehiculo.km)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CamionesEnRuta
