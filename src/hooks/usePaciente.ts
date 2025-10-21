import { useState, useEffect } from 'react'
import { authService } from '@/services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export interface PacienteAPI {
  id: string
  rut: string
  nombre: string
  sexo: 'M' | 'F' | 'O'
  fecha_nacimiento: string
  edad: number
  prevision_1: 'FONASA' | 'ISAPRE' | 'PARTICULAR' | 'OTRO'
  prevision_2: 'FONASA' | 'ISAPRE' | 'PARTICULAR' | 'OTRO'
  convenio?: string
  score_social?: number
  created_at: string
  updated_at: string
}

export function usePaciente(id?: string) {
  const [paciente, setPaciente] = useState<PacienteAPI | null>(null)
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
