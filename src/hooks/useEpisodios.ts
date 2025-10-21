import { useState, useEffect } from 'react'
import { authService } from '@/services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export interface Episodio {
  id: string
  episodio_cmbd: string
  especialidad: string
  tipo_actividad: string
  fecha_ingreso: string
  fecha_egreso: string | null
  estancia_norma_grd?: number
  estancia_prequirurgica?: number
  estancia_postquirurgica?: number
  paciente: string | null
  cama?: {
    id: string
    codigo_cama: string
  } | null
  created_at: string
  updated_at: string
}

export function useEpisodios() {
  const [episodios, setEpisodios] = useState<Episodio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEpisodios = async () => {
      try {
        const res = await authService.fetchWithAuth(`${API_BASE_URL}/episodios/`)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const json = await res.json()
        setEpisodios(json.results || json)
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
