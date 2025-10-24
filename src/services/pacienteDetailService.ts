/**
 * Servicio para manejar las operaciones relacionadas con el detalle de pacientes
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export interface PacienteDetail {
  id: string
  rut: string
  nombre: string
  sexo: 'M' | 'F' | 'O'
  fecha_nacimiento: string
  edad: number
  prevision_1?: string
  prevision_2?: string
  convenio?: string
  score_social?: number
  created_at: string
  updated_at: string
  episodios: Episodio[]
}

export interface Episodio {
  id: string
  episodio_cmbd: number
  fecha_ingreso: string
  fecha_egreso?: string
  tipo_actividad: string
  inlier_outlier_flag?: string
  especialidad?: string
  estancia_prequirurgica?: number
  estancia_postquirurgica?: number
  estancia_norma_grd?: number
  estancia_dias: number
  cama?: {
    id: string
    codigo_cama: string
    habitacion: string
  }
}

class PacienteDetailService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  /**
   * Obtiene los detalles completos de un paciente incluyendo sus episodios
   */
  async getPacienteDetail(pacienteId: string): Promise<PacienteDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Paciente no encontrado')
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const pacienteData = await response.json()
      
      // Obtener episodios del paciente
      const episodiosResponse = await fetch(`${API_BASE_URL}/episodios/por_paciente/?paciente_id=${pacienteId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      let episodios: Episodio[] = []
      if (episodiosResponse.ok) {
        episodios = await episodiosResponse.json()
      }

      return {
        ...pacienteData,
        episodios
      }
    } catch (error) {
      console.error('Error al obtener detalle del paciente:', error)
      throw error
    }
  }

  /**
   * Obtiene el historial de un paciente
   */
  async getPacienteHistorial(pacienteId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}/historial/`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error al obtener historial del paciente:', error)
      throw error
    }
  }

  /**
   * Obtiene estadísticas del paciente
   */
  async getPacienteEstadisticas(pacienteId: string): Promise<any> {
    try {
      // Por ahora calculamos estadísticas básicas del lado del cliente
      const pacienteDetail = await this.getPacienteDetail(pacienteId)
      
      const totalEpisodios = pacienteDetail.episodios.length
      const episodiosActivos = pacienteDetail.episodios.filter(ep => !ep.fecha_egreso).length
      const episodiosCerrados = totalEpisodios - episodiosActivos
      
      const estanciaPromedio = pacienteDetail.episodios.length > 0 
        ? pacienteDetail.episodios.reduce((sum, ep) => sum + ep.estancia_dias, 0) / pacienteDetail.episodios.length
        : 0

      return {
        total_episodios: totalEpisodios,
        episodios_activos: episodiosActivos,
        episodios_cerrados: episodiosCerrados,
        estancia_promedio: Math.round(estanciaPromedio * 10) / 10
      }
    } catch (error) {
      console.error('Error al obtener estadísticas del paciente:', error)
      throw error
    }
  }
}

export const pacienteDetailService = new PacienteDetailService()