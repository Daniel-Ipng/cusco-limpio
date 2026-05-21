import { Routes, Route } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import AsignarVehiculo from './pages/AsignarVehiculo'
import AsignarHorario from './pages/AsignarHorario'
import HomeCiudadano from './pages/HomeCiudadano'
import Landing from './pages/Landing'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/ciudadano" element={<HomeCiudadano />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="horarios" element={<AsignarHorario />} />
        <Route path="vehiculos" element={<AsignarVehiculo />} />
        <Route path="zonas" element={<div className="p-8"><h1 className="text-2xl font-bold">Asignar Zona</h1></div>} />
        <Route path="rutas" element={<div className="p-8"><h1 className="text-2xl font-bold">Rutas</h1></div>} />
        <Route path="camiones" element={<div className="p-8"><h1 className="text-2xl font-bold">Camiones en Ruta</h1></div>} />
        <Route path="reportes" element={<div className="p-8"><h1 className="text-2xl font-bold">Reportes</h1></div>} />
      </Route>
    </Routes>
  )
}

export default App