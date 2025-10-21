import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { TareasPendientes } from '@/components/TareasPendientes'
import { ExtensionesCriticas } from '@/components/ExtensionesCriticas'
import { AlertasPredichas } from '@/components/AlertasPredichas'
import { EstadisticasTareasChart, TiposGestionChart, TendenciaEstadiaChart } from '@/components/Charts'
import { useApi } from '@/hooks/useApi'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

interface BackendData {
  status?: string
  message?: string
  version?: string
  [key: string]: unknown
}

export function DashboardPage() {
  const { user } = useAuth()
  const api = useApi()
  const [backendData, setBackendData] = useState<BackendData | null>(null)
  const [healthLoading, setHealthLoading] = useState(true)
  
  // Hook personalizado con todos los datos del dashboard
  const {
    stats,
    tareasPendientes,
    extensionesCriticas,
    estadisticasGestiones,
    tendenciaEstadia,
    loading: dashboardLoading,
    error: dashboardError
  } = useDashboard()
  
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const data = await api.publicGet('/health/')
        setBackendData(data as BackendData)
      } catch (error) {
        console.error('Error fetching backend data:', error)
      } finally {
        setHealthLoading(false)
      }
    }
    
    fetchBackendData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - fetch only once on mount

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Gestión centralizada de estadías hospitalarias</p>
        </div>

        {/* Auth0 Connection Status */}
        <div className="mb-6">
          <Card className="bg-white border-1 shadow">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Estado de Conexión</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Usuario:</h4>
                  <p className="text-sm text-gray-600">{user?.nombre_completo || 'Cargando...'}</p>
                  <p className="text-sm text-gray-500">{user?.email || 'Cargando...'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Backend:</h4>
                  {healthLoading ? (
                    <p className="text-sm text-yellow-600">Conectando...</p>
                  ) : backendData ? (
                    <div>
                      <p className="text-sm text-green-600">✅ Conectado</p>
                      <p className="text-xs text-gray-500">{backendData.message}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">❌ Error de conexión</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error del dashboard */}
        {dashboardError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">Error al cargar datos del dashboard: {dashboardError}</p>
          </div>
        )}

        {/* Gráficos de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <EstadisticasTareasChart 
            data={estadisticasGestiones?.por_estado || []} 
            loading={dashboardLoading}
          />
          <TiposGestionChart 
            data={estadisticasGestiones?.por_tipo_gestion || []} 
            loading={dashboardLoading}
          />
          <TendenciaEstadiaChart 
            data={tendenciaEstadia} 
            loading={dashboardLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <TareasPendientes 
              tareas={tareasPendientes} 
              loading={dashboardLoading}
            />
            <ExtensionesCriticas 
              extensiones={extensionesCriticas} 
              loading={dashboardLoading}
            />
          </div>

          <div className="space-y-8">
            <AlertasPredichas />
            
            {/* Tarjetas de métricas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl border-0">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: '#f3e8ff' }}>
                    <svg className="w-6 h-6" style={{ color: '#671E75' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Episodios Activos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardLoading ? '...' : stats?.episodios_activos || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-0">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: '#ECEFCF' }}>
                    <svg className="w-6 h-6" style={{ color: '#8FA31E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Altas Hoy</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardLoading ? '...' : stats?.altas_hoy || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-0">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: '#FBF2CC' }}>
                    <svg className="w-6 h-6" style={{ color: '#E3AE00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Promedio Estadía</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardLoading ? '...' : `${stats?.promedio_estadia_dias || 0} días`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border-0">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: '#F3D7E0' }}>
                    <svg className="w-6 h-6" style={{ color: '#B95E82' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Extensiones Críticas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardLoading ? '...' : stats?.extensiones_criticas || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
