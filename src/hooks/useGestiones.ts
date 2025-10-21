import { useState, useEffect } from 'react'
import { authService } from '@/services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

// Interfaz adaptada a tu modelo Django
export interface Gestion {
  id: string
  episodio: string
  tipo_gestion: string
  informe: string
  estado_gestion: string
  fecha_inicio: string
  fecha_fin: string | null
  created_at: string
  updated_at: string
  usuario?: string
}

export function useGestiones(episodioId?: string) {
  const [gestiones, setGestiones] = useState<Gestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!episodioId) {
      setGestiones([])
      setLoading(false)
      return
    }

    const fetchGestiones = async () => {
      try {
        setLoading(true)
        setError(null)

        const url = `${API_BASE_URL}/gestiones/?episodio=${episodioId}`

        const res = await authService.fetchWithAuth(url)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const data = await res.json()

        setGestiones(data.results || data)
      } catch (err) {
        console.error('Error cargando gestiones:', err)
        setError('No se pudieron cargar las gestiones')
      } finally {
        setLoading(false)
      }
    }

    fetchGestiones()
  }, [episodioId])

  return { gestiones, loading, error }
}
