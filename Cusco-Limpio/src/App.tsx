import { Routes, Route } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import AsignarVehiculo from './pages/AsignarVehiculo'
import AsignarHorario from './pages/AsignarHorario'
import AsignarZona from './pages/AsignarZona'
import Rutas from './pages/Rutas'
import CamionesEnRuta from './pages/CamionesEnRuta'
import Reportes from './pages/Reportes'
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
        <Route path="zonas" element={<AsignarZona />} />
        <Route path="rutas" element={<Rutas />} />
        <Route path="camiones" element={<CamionesEnRuta />} />
        <Route path="reportes" element={<Reportes />} />
      </Route>
    </Routes>
  )
}

export default App