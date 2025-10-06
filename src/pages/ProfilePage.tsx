import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Header } from '@/components/Header'

export function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-semibold">Perfil de Usuario</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Nombre de Usuario</h2>
              <p className="text-lg">{user.username}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Rol</h2>
              <p className="text-lg">Administrador</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Estado</h2>
              <p className="text-lg">Activo</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}