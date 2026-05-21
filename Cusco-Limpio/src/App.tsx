import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import AsignarVehiculo from './pages/AsignarVehiculo'
import AsignarHorario from './pages/AsignarHorario'
import HomeCiudadano from './pages/HomeCiudadano'
import Landing from './pages/Landing'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas del ciudadano */}
      <Route path="/ciudadano" element={
        <ProtectedRoute roles={['ciudadano']}>
          <HomeCiudadano />
        </ProtectedRoute>
      }/>

      {/* Rutas del admin — protegidas */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="vehiculos" replace />} />
        <Route path="horarios" element={<AsignarHorario />} />
        <Route path="vehiculos" element={<AsignarVehiculo />} />
        <Route path="zonas" element={<div className="p-8"><h1 className="text-2xl font-bold">Asignar Zona</h1></div>} />
        <Route path="rutas" element={<div className="p-8"><h1 className="text-2xl font-bold">Rutas</h1></div>} />
        <Route path="camiones" element={<div className="p-8"><h1 className="text-2xl font-bold">Camiones en Ruta</h1></div>} />
        <Route path="reportes" element={<div className="p-8"><h1 className="text-2xl font-bold">Reportes</h1></div>} />
      </Route>

      {/* Cualquier ruta desconocida redirige al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App