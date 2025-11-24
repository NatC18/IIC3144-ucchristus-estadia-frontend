import { useState, useCallback } from 'react'
import { authService } from '@/services/authService'
import type { Nota } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export interface NotaInput {
  gestion: string
  descripcion: string
  estado?: string
  usuario?: string | null
}

export function useNotas() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create a new nota
  const createNota = useCallback(async (notaData: NotaInput): Promise<Nota> => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.fetchWithAuth(`${API_BASE_URL}/notas/`, {
        method: 'POST',
        body: JSON.stringify(notaData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error creating nota')
      }

      const newNota = await response.json()
      return newNota
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update a nota
  const updateNota = useCallback(async (id: string, notaData: Partial<NotaInput>): Promise<Nota> => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.fetchWithAuth(`${API_BASE_URL}/notas/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(notaData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error updating nota')
      }

      const updatedNota = await response.json()
      return updatedNota
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete a nota
  const deleteNota = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.fetchWithAuth(`${API_BASE_URL}/notas/${id}/`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error deleting nota')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createNota,
    updateNota,
    deleteNota,
  }
}
