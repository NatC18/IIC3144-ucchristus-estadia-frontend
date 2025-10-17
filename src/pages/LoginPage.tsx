import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import logoUCChristus from '@/assets/logo-uc-christus.png'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, error, clearError } = useAuth()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // Limpiar errores al cambiar campos
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [email, password, clearError])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      return
    }

    setIsLoading(true)
    
    try {
      await login(email, password)
      // La navegación se maneja en el useEffect cuando isAuthenticated cambie
    } catch (error) {
      console.error('Error en login:', error)
      // El error se maneja automáticamente por el contexto
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#671E75]"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md bg-white border-1 shadow">
        <CardHeader className="space-y-4 text-center">
          <img 
            src={logoUCChristus} 
            alt="UC CHRISTUS" 
            className="h-12 mx-auto"
          />
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600" htmlFor="email">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ucchristus.cl"
                required
                disabled={isLoading}
                className="bg-white/50 border-gray-200 focus:border-[#671E75] focus:ring-[#671E75]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600" htmlFor="password">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/50 border-gray-200 focus:border-[#671E75] focus:ring-[#671E75]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full text-white transition-all duration-200 transform active:scale-95 hover:bg-[#561563] hover:shadow-lg disabled:opacity-50" 
              type="submit"
              disabled={isLoading || !email || !password}
              style={{ backgroundColor: '#671E75' }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Ingresando...
                </div>
              ) : (
                'Ingresar'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}