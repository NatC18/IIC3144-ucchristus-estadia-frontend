import { User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import logoUCChristus from '@/assets/logo-uc-christus.png'

export function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error en logout:', error)
      // Forzar navegación aunque haya error
      navigate('/login')
    }
  }

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center">
            <img 
              src={logoUCChristus} 
              alt="UC CHRISTUS" 
              className="h-10 w-auto" 
            />
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `transition-colors ${isActive ? 'text-[#671E75]' : 'text-gray-600 hover:text-[#671E75]'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/gestiones" 
              className={({ isActive }) => 
                `transition-colors ${isActive ? 'text-[#671E75]' : 'text-gray-600 hover:text-[#671E75]'}`
              }
            >
              Gestiones
            </NavLink>
            <NavLink 
              to="/pacientes" 
              className={({ isActive }) => 
                `transition-colors ${isActive ? 'text-[#671E75]' : 'text-gray-600 hover:text-[#671E75]'}`
              }
            >
              Pacientes
            </NavLink>
            <NavLink 
              to="/excel-management" 
              className={({ isActive }) => 
                `transition-colors ${isActive ? 'text-[#671E75]' : 'text-gray-600 hover:text-[#671E75]'}`
              }
            >
              Excel
            </NavLink>
            <NavLink 
              to="/episodios" 
              className={({ isActive }) => 
                `transition-colors ${isActive ? 'text-[#671E75]' : 'text-gray-600 hover:text-[#671E75]'}`
              }
            >
              Episodios
            </NavLink>
            <Link to="#" className="text-gray-600 transition-colors hover:text-[#671E75] mr-12">
              Administrativo
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Información del usuario */}
          {user && (
            <div className="flex items-center gap-3 text-sm">
              <div className="text-right">
                <div className="font-medium text-gray-900">{user.nombre_completo}</div>
                <div className="text-gray-500 text-xs">{user.rol}</div>
              </div>
            </div>
          )}
          
          <Link 
            to="/profile" 
            className="text-gray-600 transition-colors hover:text-[#671E75]"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="transition-colors hover:text-[#671E75]"
            >
              <User className="h-6 w-6" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="transition-colors hover:text-[#671E75] hover:bg-red-50"
            title="Cerrar sesión"
          >
            <LogOut className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}
