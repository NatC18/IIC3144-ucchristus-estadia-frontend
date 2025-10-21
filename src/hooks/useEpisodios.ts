import { useState, useEffect } from 'react'
import { authService } from '@/services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export function useEpisodios() {
  const [episodios, setEpisodios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEpisodios = async () => {
      try {
        const res = await authService.fetchWithAuth(`${API_BASE_URL}/episodios/`)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const json = await res.json()
        setEpisodios(json.results || json)
        console.log('Episodios fetched:', json)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los episodios')
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodios()
  }, [])

  return { episodios, loading, error }
}
