import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Header } from '@/components/Header'

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">Acceso requerido</h2>
                  <p className="text-gray-600">Inicia sesión para ver tu perfil</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-2">Información de tu cuenta</p>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Información Personal</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                  <p className="text-lg">{user?.nombre_completo || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg">{user?.email || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rol</p>
                  <p className="text-lg">{user?.rol || 'No asignado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Usuario</p>
                  <p className="text-lg">{user?.is_staff ? 'Administrador' : 'Usuario'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}