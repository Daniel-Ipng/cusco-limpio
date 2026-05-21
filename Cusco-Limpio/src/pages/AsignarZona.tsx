import { useEffect, useState } from 'react'

type Zona = {
  id: number
  nombre: string
}

const API_BASE = 'http://localhost:3000/api'

function AsignarZona() {
  const [zonas, setZonas] = useState<Zona[]>([])

  useEffect(() => {
    async function cargarZonas() {
      try {
        const response = await fetch(`${API_BASE}/zonas`)
        if (!response.ok) {
          throw new Error('Error de zonas')
        }
        setZonas(await response.json())
      } catch (error) {
        window.alert('No se pudieron cargar las zonas')
      }
    }

    void cargarZonas()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Asignar Zona</h1>
        <p className="text-sm text-gray-500">Zonas registradas en el sistema</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        {zonas.length === 0 ? (
          <p className="text-sm text-gray-500">No hay zonas registradas</p>
        ) : (
          <div className="flex flex-col gap-2">
            {zonas.map(zona => (
              <div key={zona.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-700">{zona.nombre}</span>
                <span className="text-xs text-gray-400">ID {zona.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AsignarZona
