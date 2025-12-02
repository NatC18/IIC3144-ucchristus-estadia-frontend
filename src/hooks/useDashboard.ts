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
  estado: 'Abierta' | 'En progreso' | 'Completada' | 'Cancelada'
  fecha_inicio: string
}

export interface ExtensionCritica {
  id: string | number
  episodio: string
  paciente: string
  dias_estadia: number
  fecha_ingreso: string
  ignorar?: boolean | number | string | null
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

export interface TopScoreItem {
  id: number
  nombre: string
  rut: string
  score_social: number
}

export interface AlertaPrediccion {
  id: number
  episodio: string
  paciente: string
  dias_estadia: number
  dias_esperados: number
  fecha_ingreso: string
}

export interface DashboardData {
  stats: DashboardStats | null
  tareasPendientes: TareaPendiente[]
  extensionesCriticas: ExtensionCritica[]
  toggleIgnorarExtension: (extension: ExtensionCritica) => Promise<void>
  alertasPrediccion: AlertaPrediccion[]
  estadisticasGestiones: EstadisticasGestiones | null
  tendenciaEstadia: TendenciaEstadia[]
  sinScoreSocial: number | null
  topScoreSocial: TopScoreItem[]
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
  const [alertasPrediccion, setAlertasPrediccion] = useState<AlertaPrediccion[]>([])
  const [estadisticasGestiones, setEstadisticasGestiones] = useState<EstadisticasGestiones | null>(null)
  const [tendenciaEstadia, setTendenciaEstadia] = useState<TendenciaEstadia[]>([])
  const [sinScoreSocial, setSinScoreSocial] = useState<number | null>(null)
  const [topScoreSocial, setTopScoreSocial] = useState<TopScoreItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const parseIgnorar = (valor: ExtensionCritica['ignorar']) =>
      valor === true || valor === 1 || valor === '1'

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Llamadas paralelas a todos los endpoints usando authService
        const [statsRes, tareasRes, extensionesRes, alertasRes, gestionesStatsRes, tendenciaRes, scoreRes, topScoreRes] = await Promise.all([
          authService.fetchWithAuth(`${API_BASE_URL}/episodios/estadisticas/`),
          authService.fetchWithAuth(`${API_BASE_URL}/gestiones/tareas_pendientes/`),
          authService.fetchWithAuth(`${API_BASE_URL}/episodios/extensiones_criticas/`),
          authService.fetchWithAuth(`${API_BASE_URL}/episodios/alertas_prediccion/`),
          authService.fetchWithAuth(`${API_BASE_URL}/gestiones/estadisticas/`),
          authService.fetchWithAuth(`${API_BASE_URL}/episodios/tendencia_estadia/`),
          authService.fetchWithAuth(`${API_BASE_URL}/pacientes/score_social_faltante/`),
          authService.fetchWithAuth(`${API_BASE_URL}/pacientes/score_social_top/?limit=5`),
        ])

        setStats(await statsRes.json() as DashboardStats)
        setTareasPendientes(await tareasRes.json() as TareaPendiente[])
        const extensionesJson = await extensionesRes.json() as ExtensionCritica[]
        setExtensionesCriticas(extensionesJson.map((ext) => ({
          ...ext,
          ignorar: parseIgnorar(ext.ignorar),
        })))
        setAlertasPrediccion(await alertasRes.json() as AlertaPrediccion[])
        setEstadisticasGestiones(await gestionesStatsRes.json() as EstadisticasGestiones)
        setTendenciaEstadia(await tendenciaRes.json() as TendenciaEstadia[])
  const scoreJson = await scoreRes.json() as { sin_score_social: number }
  setSinScoreSocial(scoreJson?.sin_score_social ?? 0)
    const topJson = await topScoreRes.json() as { top: TopScoreItem[] }
    setTopScoreSocial(topJson?.top ?? [])
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, []) // Solo se ejecuta al montar

  const toggleIgnorarExtension = async (extension: ExtensionCritica) => {
    const parseIgnorar = (valor: ExtensionCritica['ignorar']) =>
      valor === true || valor === 1 || valor === '1'

    const siguienteValor = !parseIgnorar(extension.ignorar)

    try {
      const response = await authService.fetchWithAuth(`${API_BASE_URL}/episodios/${extension.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ignorar: siguienteValor }),
      })

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado de ignorar')
      }

      // Actualizar el estado local sin esperar un refetch completo
      const payload = await response.json().catch(() => null)
      setExtensionesCriticas((prev) =>
        prev.map((ext) =>
          ext.id === extension.id
            ? {
                ...ext,
                ignorar: parseIgnorar(
                  (payload as ExtensionCritica | null)?.ignorar ?? siguienteValor,
                ),
              }
            : ext,
        ),
      )
    } catch (err) {
      console.error('Error al cambiar ignorar en extensión crítica:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }

  return {
    stats,
    alertasPrediccion,
    tareasPendientes,
    extensionesCriticas,
    toggleIgnorarExtension,
    estadisticasGestiones,
    tendenciaEstadia,
    sinScoreSocial,
    topScoreSocial,
    loading,
    error,
  }
}
