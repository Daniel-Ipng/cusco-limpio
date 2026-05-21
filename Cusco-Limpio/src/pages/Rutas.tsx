import { useEffect, useState } from 'react'

type Ruta = {
  id: number
  nombre: string
  descripcion: string | null
  distancia_km: number | null
  tiempo_estimado_min: number | null
  zona: string | null
}

const API_BASE = 'http://localhost:3000/api'

function formatDistancia(distancia: number | null) {
  if (!distancia) {
    return 'Sin dato'
  }
  return `${distancia} km`
}

function formatTiempo(tiempo: number | null) {
  if (!tiempo) {
    return 'Sin dato'
  }
  return `${tiempo} min`
}

function Rutas() {
  const [rutas, setRutas] = useState<Ruta[]>([])

  useEffect(() => {
    async function cargarRutas() {
      try {
        const response = await fetch(`${API_BASE}/rutas`)
        if (!response.ok) {
          throw new Error('Error de rutas')
        }
        setRutas(await response.json())
      } catch (error) {
        window.alert('No se pudieron cargar las rutas')
      }
    }

    void cargarRutas()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Rutas</h1>
        <p className="text-sm text-gray-500">Listado de rutas municipales</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        {rutas.length === 0 ? (
          <p className="text-sm text-gray-500">No hay rutas registradas</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {rutas.map(ruta => (
              <div key={ruta.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">{ruta.nombre}</p>
                  <span className="text-xs text-gray-500">{ruta.zona || 'Sin zona'}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{ruta.descripcion || 'Sin descripcion'}</p>
                <div className="text-xs text-gray-600 flex items-center gap-3 mt-2">
                  <span>Distancia: {formatDistancia(ruta.distancia_km)}</span>
                  <span>Tiempo: {formatTiempo(ruta.tiempo_estimado_min)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Rutas
