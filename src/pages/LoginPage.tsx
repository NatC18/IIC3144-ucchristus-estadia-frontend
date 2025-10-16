import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import logoUCChristus from '@/assets/logo-uc-christus.png'

export function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
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
        <CardContent className="space-y-4">
          <Button 
            onClick={() => loginWithRedirect()}
            className="w-full text-white transition-all duration-200 transform active:scale-95 hover:bg-[#561563] hover:shadow-lg" 
            style={{ backgroundColor: '#671E75' }}
          >
            Ingresar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}