import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export interface EstadisticaEstado {
  estado_gestion: 'INICIADA' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA'
  cantidad: number
}

export interface EstadisticaTipo {
  tipo_gestion: string
  cantidad: number
}

export interface GestionesEstadisticas {
  total_gestiones: number
  por_estado: EstadisticaEstado[]
  por_tipo: EstadisticaTipo[]
  por_tipo_gestion: EstadisticaTipo[]
}

export function useGestionesEstadisticas() {
  const [estadisticas, setEstadisticas] = useState<GestionesEstadisticas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEstadisticas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const url = `${API_BASE_URL}/gestiones/estadisticas/`
      const response = await authService.fetchWithAuth(url)
      
      if (!response.ok) throw new Error(`HTTP error ${response.status}`)
      
      const data: GestionesEstadisticas = await response.json()
      setEstadisticas(data)

    } catch (err) {
      console.error('Error loading gestiones estadisticas:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setEstadisticas(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load estadisticas on mount
  useEffect(() => {
    fetchEstadisticas()
  }, [fetchEstadisticas])

  return { 
    estadisticas, 
    loading, 
    error, 
    refetch: fetchEstadisticas 
  }
}
