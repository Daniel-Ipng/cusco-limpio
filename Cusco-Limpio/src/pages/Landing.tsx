import { useNavigate } from 'react-router-dom'
import heroBg from '../assets/hero.jpeg'
function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1a7a5e] rounded-lg flex items-center justify-center text-lg">
            ♻️
          </div>
          <div>
            <p className="font-bold text-gray-800">Cusco Limpio</p>
            <p className="text-xs text-gray-500">Sistema de recolección de residuos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/ciudadano')}
            className="text-sm font-medium text-[#1a7a5e] border border-[#1a7a5e] px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            Ver horarios
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-white bg-[#1a7a5e] px-4 py-2 rounded-lg hover:bg-[#155f49] transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </header>

      {/* Hero */}
      <div 
        className="relative flex items-center justify-center min-h-[500px] px-6"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay oscuro para que el texto se lea bien */}
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center py-24">
          <div className="w-16 h-16 bg-[#1a7a5e] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
            ♻️
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Gestión inteligente de residuos en Cusco
          </h1>
          <p className="text-gray-200 text-lg mb-8">
            Consulta los horarios de recolección de tu zona o accede al panel municipal para gestionar la flota y los turnos.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/ciudadano')}
              className="bg-[#1a7a5e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#155f49] transition-colors"
            >
              Ver horarios de recolección
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-white border border-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Panel municipal
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Landing