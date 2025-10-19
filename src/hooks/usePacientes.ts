import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

// Interfaz que coincide con la respuesta del backend
export interface PacienteAPI {
  id: string
  rut: string
  nombre: string
  sexo: 'M' | 'F' | 'O'
  fecha_nacimiento: string
  edad: number
  prevision_1: 'FONASA' | 'ISAPRE' | 'PARTICULAR' | 'OTRO'
  convenio?: string
  score_social?: number
  created_at: string
  updated_at: string
}

// Interfaz para la respuesta paginada del backend
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export function usePacientes() {
  const [pacientes, setPacientes] = useState<PacienteAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchPacientes = useCallback(async (filters?: {
    search?: string
    sexo?: string
    prevision?: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      // Construir query params
      const params = new URLSearchParams()
      if (filters?.search) params.append('search', filters.search)
      if (filters?.sexo) params.append('sexo', filters.sexo)
      if (filters?.prevision) params.append('prevision', filters.prevision)

      const queryString = params.toString()
      const url = `${API_BASE_URL}/pacientes/${queryString ? `?${queryString}` : ''}`

      console.log('Fetching from:', url)

      // Usar authService para hacer la petición autenticada
      const response = await authService.fetchWithAuth(url, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PaginatedResponse<PacienteAPI> = await response.json()
      
      setPacientes(data.results || [])
      setTotalCount(data.count || 0)
      
      console.log('Pacientes loaded:', data.results?.length || 0)
      
    } catch (err) {
      console.error('Error fetching pacientes:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setPacientes([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar pacientes al montar el componente
  useEffect(() => {
    fetchPacientes()
  }, [fetchPacientes])

  // Función de refetch memoizada
  const refetch = useCallback(() => fetchPacientes(), [fetchPacientes])

  return {
    pacientes,
    loading,
    error,
    totalCount,
    fetchPacientes,
    refetch,
  }
}

export function usePaciente() {
  const [paciente, setPaciente] = useState<PacienteAPI | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPaciente = useCallback(async (id: string) => {

    if (!id) return
    try {
      setLoading(true)
      setError(null)

      const url = `${API_BASE_URL}/pacientes/${id}`

      console.log('Fetching from:', url)

      // Usar authService para hacer la petición autenticada
      const response = await authService.fetchWithAuth(url, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PacienteAPI = await response.json()

      setPaciente(data)
      console.log('Paciente loaded:', data)

    } catch (err) {
      console.error('Error fetching paciente:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setPaciente(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    paciente,
    loading,
    error,
    fetchPaciente,
  }
}

