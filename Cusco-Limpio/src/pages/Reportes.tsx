import { useEffect, useMemo, useState } from 'react'

type Programacion = {
  id: number
  vehiculo: string | null
}

type Vehiculo = {
  id: number
  estado: string
}

const API_BASE = 'http://localhost:3000/api'

function Reportes() {
  const [programaciones, setProgramaciones] = useState<Programacion[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])

  const resumen = useMemo(() => {
    const totalProgramaciones = programaciones.length
    const sinVehiculo = programaciones.filter(p => !p.vehiculo).length
    const enRuta = vehiculos.filter(v => v.estado === 'en_ruta').length
    const disponibles = vehiculos.filter(v => v.estado === 'disponible').length

    return { totalProgramaciones, sinVehiculo, enRuta, disponibles }
  }, [programaciones, vehiculos])

  useEffect(() => {
    async function cargarReportes() {
      try {
        const [programacionesRes, vehiculosRes] = await Promise.all([
          fetch(`${API_BASE}/programaciones`),
          fetch(`${API_BASE}/vehiculos`),
        ])

        if (!programacionesRes.ok || !vehiculosRes.ok) {
          throw new Error('Error de reportes')
        }

        setProgramaciones(await programacionesRes.json())
        setVehiculos(await vehiculosRes.json())
      } catch (error) {
        window.alert('No se pudieron cargar los reportes')
      }
    }

    void cargarReportes()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
        <p className="text-sm text-gray-500">Resumen operativo del dia</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: 'P', valor: resumen.totalProgramaciones, label: 'Programaciones' },
          { icon: 'R', valor: resumen.enRuta, label: 'Vehiculos en ruta' },
          { icon: 'D', valor: resumen.disponibles, label: 'Vehiculos disponibles' },
          { icon: '!', valor: resumen.sinVehiculo, label: 'Turnos sin vehiculo' },
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
    </div>
  )
}

export default Reportes
