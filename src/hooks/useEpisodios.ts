import { useState, useEffect } from 'react'
import { authService } from '@/services/authService'
import type { Episodio, PaginatedResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export function useEpisodios() {
  const [episodios, setEpisodios] = useState<Episodio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEpisodios = async () => {
      try {
        const res = await authService.fetchWithAuth(`${API_BASE_URL}/episodios/`)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const json = await res.json() as PaginatedResponse<Episodio> | Episodio[]
        
        // Manejar respuesta paginada o array directo
        const episodiosData = Array.isArray(json) ? json : json.results
        setEpisodios(episodiosData)
      } catch (err) {
        console.error('Error cargando episodios:', err)
        setError('No se pudieron cargar los episodios')
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodios()
  }, [])

  return { episodios, loading, error }
}
