import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/services/authService'
import type { Servicio } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'


export function useServicios(episodioId?: string) {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServicios = useCallback(async () => {
    try {
      if (episodioId) {
        setLoading(true)
        setError(null)

        const url = `${API_BASE_URL}/episodios/${episodioId}/servicios/`

        const response = await authService.fetchWithAuth(url)
        
        if (!response.ok) throw new Error(`HTTP error ${response.status}`)

        const data: Servicio[] = await response.json()


        setServicios(data || [])

        console.log('Servicios cargados:', data)
      }

    } catch (err) {
      console.error('Error loading servicios:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setServicios([])
    } finally {
      setLoading(false)
    }
  }, [episodioId])
// Load servicios on mount and when episodioId changes

  useEffect(() => {
    fetchServicios()
  }, [fetchServicios])

  return {
    servicios,
    loading,
    error,
    fetchServicios,
  }
}