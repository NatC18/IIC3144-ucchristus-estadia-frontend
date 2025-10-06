import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import logoUCChristus from '@/assets/logo-uc-christus.png'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple validation
    if (username && password) {
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({ username }))
      // Redirect to dashboard
      navigate('/dashboard')
    }
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
          <h2 className="text-2xl font-semibold text-gray-800">Iniciar sesión</h2>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600" htmlFor="username">
                Usuario
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
                className="bg-white/50 border-gray-200 focus:border-[#671E75] focus:ring-[#671E75]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full text-white transition-all duration-200 transform active:scale-95 hover:bg-[#561563] hover:shadow-lg" 
              type="submit"
              style={{ backgroundColor: '#671E75' }}
            >
              Ingresar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}