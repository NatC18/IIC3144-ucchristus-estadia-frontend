import { useEffect, useState, useCallback } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Header } from '@/components/Header'
import { useApi } from '@/hooks/useApi'

interface ProfileData {
  id?: number
  username?: string
  email?: string
  nombre_completo?: string
  first_name?: string
  last_name?: string
  telefono?: string
  is_active?: boolean
  date_joined?: string
  auth0_user_id?: string
  auth0_claims?: Record<string, unknown>
}

export function ProfilePage() {
  const { user, isAuthenticated, isLoading: auth0Loading, loginWithRedirect } = useAuth0()
  const { get, post } = useApi()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      // Si Auth0 aún está cargando, esperar
      if (auth0Loading) {
        return
      }

      // Si ya inicializamos y tenemos datos, no repetir
      if (hasInitialized) {
        return
      }

      console.log('🚀 ProfilePage: Fetching profile data...')
      
      if (!isAuthenticated) {
        console.log('❌ User not authenticated')
        setLoading(false)
        setError('Usuario no autenticado')
        setHasInitialized(true)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        console.log('🔐 Fetching profile for user:', user?.email)
        
        const data = await get('/auth/profile/')
        console.log('✅ Profile data received:', data)
        console.log('📋 Profile structure:', Object.keys(data))
        setProfile(data)
        
        // Verificar si necesita sincronización automática
        if (user && (!data.email || !data.nombre_completo) && (user.email || user.name)) {
          console.log('🔄 Datos incompletos detectados, sincronizando automáticamente...')
          await syncAuth0Profile()
        }
        
        setHasInitialized(true)
      } catch (err: unknown) {
        console.error('❌ Error fetching profile:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        const errorResponse = (err as { response?: { status?: number } })?.response
        setError(`Error al cargar el perfil: ${errorResponse?.status || 'Unknown'} - ${errorMessage}`)
        setHasInitialized(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, auth0Loading, user, hasInitialized, get]) // syncAuth0Profile called conditionally

  const syncAuth0Profile = useCallback(async () => {
    if (!isAuthenticated || !user) {
      return
    }

    try {
      // Preparar datos del perfil desde Auth0
      const profileData = {
        email: user.email,
        name: user.name,
        given_name: user.given_name,
        family_name: user.family_name,
        nickname: user.nickname,
        sub: user.sub
      }
      
      console.log('🔄 Sincronización automática - Enviando datos de perfil:', profileData)
      
      const response = await post('/auth/sync-profile/', profileData)
      
      if (response.status === 'success' && response.updated_fields?.length > 0) {
        console.log(`✅ Datos sincronizados automáticamente: ${response.updated_fields.join(', ')}`)
        
        // Refrescar el perfil después de sincronizar
        const updatedProfile = await get('/auth/profile/')
        setProfile(updatedProfile)
      }
    } catch (err: unknown) {
      console.error('Error en sincronización automática:', err)
      // No mostrar errores al usuario, es automático
    }
  }, [isAuthenticated, user, post, get, setProfile])

  if (auth0Loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <h1 className="text-2xl font-semibold">Perfil de Usuario</h1>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-lg">Cargando autenticación...</div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <h1 className="text-2xl font-semibold">Perfil de Usuario</h1>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-lg mb-4">Debes iniciar sesión para ver tu perfil</p>
                <button 
                  onClick={() => loginWithRedirect()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Iniciar Sesión
                </button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <h1 className="text-2xl font-semibold">Perfil de Usuario</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <div className="text-center py-4">
                <div className="text-lg">Cargando perfil...</div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Error:</strong> {error}
                <div className="mt-2 text-sm">
                  <strong>Información de Auth0 disponible:</strong>
                  <pre className="mt-1 text-xs bg-red-50 p-2 rounded">
                    {JSON.stringify({
                      email: user?.email,
                      name: user?.name,
                      nickname: user?.nickname
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Información de Auth0 (siempre disponible) */}
            <div>
              <h2 className="text-sm font-medium text-gray-500">Email</h2>
              <p className="text-lg">{user?.email || 'No disponible'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Nombre</h2>
              <p className="text-lg">{user?.name || user?.nickname || 'No disponible'}</p>
            </div>
            
            {/* Información del backend (si está disponible) */}
            {profile && (
              <>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">ID de Usuario</h2>
                  <p className="text-lg">{profile.id || 'No especificado'}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Username</h2>
                  <p className="text-lg">{profile.username || 'No especificado'}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Teléfono</h2>
                  <p className="text-lg">{profile.telefono || 'No registrado'}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Estado de Cuenta</h2>
                  <p className={`text-lg font-medium ${profile.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {profile.is_active ? '✅ Activa' : '❌ Inactiva'}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Fecha de Registro</h2>
                  <p className="text-lg">
                    {profile.date_joined 
                      ? new Date(profile.date_joined).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        })
                      : 'No disponible'
                    }
                  </p>
                </div>
              </>
            )}
            
            {/* Información de Auth0 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-3">Información de Auth0</h3>
              <div className="text-sm space-y-1">
                <p><strong>Auth0 ID:</strong> {profile?.auth0_user_id || user?.sub}</p>
                <p><strong>Proveedor:</strong> {
                  (() => {
                    const provider = user?.sub?.split('|')?.[0];
                    return provider 
                      ? provider.replace('-oauth2', '').toUpperCase() 
                      : 'Desconocido';
                  })()
                }</p>
                <p><strong>Email verificado:</strong> {user?.email_verified ? 'Sí' : 'No'}</p>
                <p className="text-xs text-blue-600 mt-2">
                  ℹ️ Los datos se sincronizan automáticamente desde Auth0
                </p>
              </div>
            </div>

            {/* Información de fallback si el backend no está disponible */}
            {!profile && !loading && !error && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Conectando con el servidor...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Mientras tanto, mostramos tu información de Auth0
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}