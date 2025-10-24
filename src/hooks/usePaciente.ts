import { useState, useEffect } from 'react'
import { authService } from '@/services/authService'
import type { Paciente } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export function usePaciente(id?: string) {
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchPaciente = async () => {
      try {
        const res = await authService.fetchWithAuth(`${API_BASE_URL}/pacientes/${id}/`)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const data = await res.json()
        setPaciente(data)
      } catch (err) {
        console.error('Error cargando paciente:', err)
        setError('No se pudo cargar el paciente')
      } finally {
        setLoading(false)
      }
    }

    fetchPaciente()
  }, [id])

  return { paciente, loading, error }
}
