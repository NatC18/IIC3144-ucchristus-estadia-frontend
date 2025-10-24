/**
 * Hook personalizado para manejar el detalle de un paciente
 */

import { useState, useEffect, useCallback } from 'react'
import { pacienteDetailService } from '@/services/pacienteDetailService'
import type { PacienteDetail, Episodio } from '@/types'

interface UsePacienteDetailResult {
  paciente: PacienteDetail | null
  loading: boolean
  error: string | null
  selectedEpisodio: Episodio | null
  estadisticas: {
    total_episodios: number
    episodios_activos: number
    episodios_cerrados: number
    estancia_promedio: number
  } | null
  setSelectedEpisodio: (episodio: Episodio | null) => void
  refetch: () => Promise<void>
}

export function usePacienteDetail(pacienteId: string): UsePacienteDetailResult {
  const [paciente, setPaciente] = useState<PacienteDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEpisodio, setSelectedEpisodio] = useState<Episodio | null>(null)
  const [estadisticas, setEstadisticas] = useState<{
    total_episodios: number
    episodios_activos: number
    episodios_cerrados: number
    estancia_promedio: number
  } | null>(null)

  const fetchPacienteDetail = useCallback(async () => {
    if (!pacienteId) return

    try {
      setLoading(true)
      setError(null)

      // Obtener detalles del paciente
      const pacienteData = await pacienteDetailService.getPacienteDetail(pacienteId)
      setPaciente(pacienteData)

      // Obtener estadísticas
      const stats = await pacienteDetailService.getPacienteEstadisticas(pacienteId)
      setEstadisticas(stats)

      // Si hay episodios, seleccionar el más reciente por defecto
      if (pacienteData.episodios.length > 0) {
        const episodioMasReciente = pacienteData.episodios.sort((a, b) => 
          new Date(b.fecha_ingreso).getTime() - new Date(a.fecha_ingreso).getTime()
        )[0]
        setSelectedEpisodio(episodioMasReciente)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el paciente')
      console.error('Error en usePacienteDetail:', err)
    } finally {
      setLoading(false)
    }
  }, [pacienteId])

  const refetch = useCallback(async () => {
    await fetchPacienteDetail()
  }, [fetchPacienteDetail])

  useEffect(() => {
    fetchPacienteDetail()
  }, [fetchPacienteDetail])

  return {
    paciente,
    loading,
    error,
    selectedEpisodio,
    estadisticas,
    setSelectedEpisodio,
    refetch
  }
}