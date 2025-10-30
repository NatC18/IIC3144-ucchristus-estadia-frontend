import { useState, useCallback } from 'react'
import { authService } from '@/services/authService'
import type { Episodio } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export function useEpisodiosPaciente() {
  const [episodiosPaciente, setEpisodiosPaciente] = useState<Episodio[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEpisodiosPaciente = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const url = `${API_BASE_URL}/pacientes/${id}/episodios/`

      console.log('Fetching from:', url)

      // Usar authService para hacer la petición autenticada
      const response = await authService.fetchWithAuth(url, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`Error fetching episodios: ${response.statusText}`)
      }

      const data: Episodio[] = await response.json()

      console.log(`Episodios from paciente ${id} loaded:`, data)

      setEpisodiosPaciente(data || [])
    } catch (err) {
      console.error('Error fetching episodios:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setEpisodiosPaciente([])
    } finally {
      setLoading(false)
    }
  }, [])

    return {
    episodiosPaciente,
    loading,
    error,
    fetchEpisodiosPaciente,
  }
}