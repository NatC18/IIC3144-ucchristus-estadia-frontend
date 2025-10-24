import { Search, User, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
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
            <Link to="/dashboard" className="text-gray-600 transition-colors hover:text-[#671E75]">
              Dashboard
            </Link>
            <Link to="/gestiones" className="text-gray-600 transition-colors hover:text-[#671E75]">
              Gestiones
            </Link>
            <Link to="/pacientes" className="text-gray-600 transition-colors hover:text-[#671E75]">
              Pacientes
            </Link>
            <Link to="/excel-management" className="text-gray-600 transition-colors hover:text-[#671E75]">
              Excel
            </Link>
            <Link to="/episodios" className="text-gray-600 transition-colors hover:text-[#671E75]">
              Episodios
            </Link>
            <Link to="#" className="text-gray-600 transition-colors hover:text-[#671E75]">
              Alertas
            </Link>
            <Link to="#" className="text-gray-600 transition-colors hover:text-[#671E75]">
              Reportes
            </Link>
            <Link to="#" className="text-gray-600 transition-colors hover:text-[#671E75]">
              Administrativo
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Buscar" 
              className="pl-10 w-64"
            />
          </div>
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
