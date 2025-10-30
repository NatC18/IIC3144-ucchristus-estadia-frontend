import { useState, useEffect, useCallback } from 'react'
import { authService } from '@/services/authService'
import type { Paciente, PaginatedResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export function usePacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
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

      // Usar authService para hacer la petición autenticada
      const response = await authService.fetchWithAuth(url, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PaginatedResponse<Paciente> = await response.json()
      
      setPacientes(data.results || [])
      setTotalCount(data.count || 0)
      
      
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
  const [paciente, setPaciente] = useState<Paciente | null>(null)
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

      const data: Paciente = await response.json()

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

