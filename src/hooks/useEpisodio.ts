import { useState, useEffect } from 'react'
import { authService } from '@/services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export function useEpisodio(id?: string) {
  const [episodio, setEpisodio] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchEpisodio = async () => {
      try {
        const res = await authService.fetchWithAuth(`${API_BASE_URL}/episodios/${id}/`)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const data = await res.json()
        setEpisodio(data)
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar el episodio')
      } finally {
        setLoading(false)
      }
    }
    fetchEpisodio()
  }, [id])

  return { episodio, loading, error }
}
