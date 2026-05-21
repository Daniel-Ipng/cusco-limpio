import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <div className="w-9 h-9 bg-[#1a7a5e] rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">♻</span>
        </div>
        <div>
          <p className="font-bold text-gray-800 leading-tight">Cusco Limpio</p>
          <p className="text-xs text-gray-500">Panel municipal</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        
        <p className="text-xs text-gray-400 px-3 mb-1 mt-2">Recursos</p>
        <NavLink to="/admin/horarios" className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive ? 'bg-[#1a7a5e] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          📅 Asignar horario
        </NavLink>
        <NavLink to="/admin/vehiculos" className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive ? 'bg-[#1a7a5e] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          🚛 Asignar vehículo
        </NavLink>

        <p className="text-xs text-gray-400 px-3 mb-1 mt-4">Operaciones</p>
        <NavLink to="/admin/zonas" className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive ? 'bg-[#1a7a5e] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          📍 Asignar zona
        </NavLink>
        <NavLink to="/admin/rutas" className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive ? 'bg-[#1a7a5e] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          🗺️ Rutas
        </NavLink>

        <p className="text-xs text-gray-400 px-3 mb-1 mt-4">Monitoreo</p>
        <NavLink to="/admin/camiones" className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive ? 'bg-[#1a7a5e] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          👤 Camiones en ruta
        </NavLink>
        <NavLink to="/admin/reportes" className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive ? 'bg-[#1a7a5e] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          📊 Reportes
        </NavLink>

      </nav>
    </aside>
  )
}

export default Sidebar