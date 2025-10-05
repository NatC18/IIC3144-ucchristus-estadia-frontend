import { Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import logoUCChristus from '@/assets/logo-uc-christus.png'

export function Header() {
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
            <Link to="/dashboard" className="font-medium border-b-2 pb-1" style={{ color: '#671E75', borderColor: '#671E75' }}>
              Dashboard
            </Link>
            <Link to="#" className="text-gray-600 transition-colors" onMouseEnter={(e) => (e.currentTarget.style.color = '#671E75')} onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}>
              Pacientes
            </Link>
            <Link to="#" className="text-gray-600 transition-colors" onMouseEnter={(e) => (e.currentTarget.style.color = '#671E75')} onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}>
              Alertas
            </Link>
            <Link to="#" className="text-gray-600 transition-colors" onMouseEnter={(e) => (e.currentTarget.style.color = '#671E75')} onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}>
              Reportes
            </Link>
            <Link to="#" className="text-gray-600 transition-colors" onMouseEnter={(e) => (e.currentTarget.style.color = '#671E75')} onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}>
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
          <Button variant="ghost" size="icon">
            <User className="h-6 w-6 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  )
}
