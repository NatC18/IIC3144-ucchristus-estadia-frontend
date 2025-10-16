import { Search, User, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import logoUCChristus from '@/assets/logo-uc-christus.png'

export function Header() {
  const { logout, user } = useAuth0()

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
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
          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-[#671E75]"
              >
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="transition-colors hover:text-[#671E75]"
                  >
                    <User className="h-6 w-6" />
                  </Button>
                )}
              </Link>
            </div>
          )}
          
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
