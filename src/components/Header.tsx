import { Search, User, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import logoUCChristus from '@/assets/logo-uc-christus.png'

export function Header() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
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
            className="transition-colors hover:text-[#671E75]"
          >
            <LogOut className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}
