import { useEffect, useState } from 'react'
import { authService } from '@/services/authService'

// Tipos para las respuestas del backend
export interface DashboardStats {
  total_episodios: number
  episodios_activos: number
  episodios_egresados: number
  promedio_estadia_dias: number
  extensiones_criticas: number
  altas_hoy: number
}

export interface TareaPendiente {
  id: string
  episodio: string
  tipo_gestion: string
  descripcion: string
  estado: 'Abierta' | 'En proceso' | 'Cerrada'
  fecha_inicio: string
}

export interface ExtensionCritica {
  episodio: string
  paciente: string
  dias_estadia: number
  fecha_ingreso: string
}

export interface EstadisticasGestiones {
  total_gestiones: number
  por_estado: Array<{ estado_gestion: string; cantidad: number }>
  por_tipo: Array<{ tipo_gestion: string; cantidad: number }>
  por_tipo_gestion: Array<{ tipo_gestion: string; cantidad: number }>
}

export interface TendenciaEstadia {
  mes: string
  pacientes: number
}

export interface DashboardData {
  stats: DashboardStats | null
  tareasPendientes: TareaPendiente[]
  extensionesCriticas: ExtensionCritica[]
  estadisticasGestiones: EstadisticasGestiones | null
  tendenciaEstadia: TendenciaEstadia[]
  loading: boolean
  error: string | null
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

/**
 * Hook personalizado para obtener todos los datos del dashboard
 */
export function useDashboard(): DashboardData {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [tareasPendientes, setTareasPendientes] = useState<TareaPendiente[]>([])
  const [extensionesCriticas, setExtensionesCriticas] = useState<ExtensionCritica[]>([])
  const [estadisticasGestiones, setEstadisticasGestiones] = useState<EstadisticasGestiones | null>(null)
  const [tendenciaEstadia, setTendenciaEstadia] = useState<TendenciaEstadia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Llamadas paralelas a todos los endpoints usando authService
        const [statsRes, tareasRes, extensionesRes, gestionesStatsRes, tendenciaRes] = await Promise.all([
          authService.fetchWithAuth(`${API_BASE_URL}/episodios/estadisticas/`),
          authService.fetchWithAuth(`${API_BASE_URL}/gestiones/tareas_pendientes/`),
          authService.fetchWithAuth(`${API_BASE_URL}/episodios/extensiones_criticas/`),
          authService.fetchWithAuth(`${API_BASE_URL}/gestiones/estadisticas/`),
          authService.fetchWithAuth(`${API_BASE_URL}/episodios/tendencia_estadia/`),
        ])

        setStats(await statsRes.json() as DashboardStats)
        setTareasPendientes(await tareasRes.json() as TareaPendiente[])
        setExtensionesCriticas(await extensionesRes.json() as ExtensionCritica[])
        setEstadisticasGestiones(await gestionesStatsRes.json() as EstadisticasGestiones)
        setTendenciaEstadia(await tendenciaRes.json() as TendenciaEstadia[])
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, []) // Solo se ejecuta al montar

  return {
    stats,
    tareasPendientes,
    extensionesCriticas,
    estadisticasGestiones,
    tendenciaEstadia,
    loading,
    error,
  }
}
