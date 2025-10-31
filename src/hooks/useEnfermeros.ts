import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export interface Enfermero {
  id: string
  nombre: string
  apellido: string
  email: string
  rol: string
}

export function useEnfermeros() {
  const [enfermeros, setEnfermeros] = useState<Enfermero[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEnfermeros = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.fetchWithAuth(`${API_BASE_URL}/auth/enfermeros/`)
      
      if (!response.ok) throw new Error(`HTTP error ${response.status}`)
      
      const data: Enfermero[] = await response.json()
      setEnfermeros(data)

    } catch (err) {
      console.error('Error loading enfermeros:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setEnfermeros([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEnfermeros()
  }, [fetchEnfermeros])

  return { enfermeros, loading, error, refetch: fetchEnfermeros }
}
