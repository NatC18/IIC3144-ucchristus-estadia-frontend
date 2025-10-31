import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export interface Gestion {
  id: string
  episodio: string
  episodio_cmbd: string
  tipo_gestion: string
  informe: string
  estado_gestion: 'INICIADA' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA'
  fecha_inicio: string
  fecha_fin: string | null
  created_at: string
  updated_at: string
  usuario?: string | null
  usuario_nombre?: string
  paciente_id?: string
  paciente_nombre?: string
  // Traslado fields
  centro_destinatario?: string | null
  motivo_traslado?: string | null
  tipo_solicitud?: string | null
  nivel_atencion?: string | null
  diagnostico_transfer?: string | null
  estado_transfer?: string | null
  fecha_hora_inicio_traslado?: string | null
  fecha_hora_finalizacion_traslado?: string | null
}

// Interfaz para la respuesta paginada
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// Interfaz para crear/actualizar gestión
export interface GestionInput {
  episodio: string
  usuario?: string | null
  tipo_gestion: string
  informe: string
  estado_gestion: 'INICIADA' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA'
  fecha_inicio: string
  fecha_fin?: string | null
  // Traslado fields
  centro_destinatario?: string | null
  motivo_traslado?: string | null
  tipo_solicitud?: string | null
  nivel_atencion?: string | null
  diagnostico_transfer?: string | null
  estado_transfer?: string | null
  fecha_hora_inicio_traslado?: string | null
  fecha_hora_finalizacion_traslado?: string | null
}

export function useGestiones(episodioId?: string) {
  const [gestiones, setGestiones] = useState<Gestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchGestiones = useCallback(async (filters?: {
    search?: string
    estado?: string
    episodio?: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      // Construir query params
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.estado) params.append('estado_gestion', filters.estado)
      if (filters?.episodio || episodioId) params.append('episodio', filters?.episodio || episodioId || '')

      const queryString = params.toString()
      const url = `${API_BASE_URL}/gestiones/${queryString ? `?${queryString}` : ''}`

      const response = await authService.fetchWithAuth(url)
      
      if (!response.ok) throw new Error(`HTTP error ${response.status}`)
      
      const data: PaginatedResponse<Gestion> = await response.json()
      
      setGestiones(data.results || [])
      setTotalCount(data.count || 0)

    } catch (err) {
      console.error('Error loading gestiones:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setGestiones([])
    } finally {
      setLoading(false)
    }
  }, [episodioId])

  // Create a new gestion
  const createGestion = async (gestionData: GestionInput): Promise<Gestion> => {
    const response = await authService.fetchWithAuth(`${API_BASE_URL}/gestiones/`, {
      method: 'POST',
      body: JSON.stringify(gestionData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error creating gestion')
    }

    const newGestion = await response.json()
    await fetchGestiones() // Refresh the list
    return newGestion
  }

  // Update a gestion
  const updateGestion = async (id: string, gestionData: Partial<GestionInput>): Promise<Gestion> => {
    const response = await authService.fetchWithAuth(`${API_BASE_URL}/gestiones/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(gestionData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error updating gestion')
    }

    const updatedGestion = await response.json()
    await fetchGestiones() // Refresh the list
    return updatedGestion
  }

  // Delete a gestion
  const deleteGestion = async (id: string): Promise<void> => {
    const response = await authService.fetchWithAuth(`${API_BASE_URL}/gestiones/${id}/`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error deleting gestion')
    }

    await fetchGestiones() // Refresh the list
  }

  // Load gestiones on mount and when episodioId changes
  useEffect(() => {
    fetchGestiones()
  }, [fetchGestiones])

  return {
    gestiones,
    loading,
    error,
    totalCount,
    fetchGestiones,
    createGestion,
    updateGestion,
    deleteGestion,
  }
}

// Hook for single gestion
export function useGestion(id: string) {
  const [gestion, setGestion] = useState<Gestion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGestion = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await authService.fetchWithAuth(`${API_BASE_URL}/gestiones/${id}/`)
      
      if (!response.ok) throw new Error(`HTTP error ${response.status}`)
      
      const data: Gestion = await response.json()
      setGestion(data)

    } catch (err) {
      console.error('Error loading gestion:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setGestion(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchGestion()
  }, [fetchGestion])

  

  return { gestion, loading, error, refetch: fetchGestion }

}
