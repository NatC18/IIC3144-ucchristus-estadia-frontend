import type { Paciente as PacienteAPI } from '@/types'

// Interfaz simplificada para vistas de lista (mantenemos la original del mockData)
export interface PacienteSimplificado {
  id: string
  nombre: string
  score: number
  rut: string
  prevision: string
  edad: number
  sexo: 'M' | 'F'
  hospitalizado: boolean
}

// Función para convertir datos del backend al formato simplificado del frontend
export function mapPacienteFromAPI(apiPaciente: PacienteAPI): PacienteSimplificado {
  return {
    id: apiPaciente.id,
    nombre: apiPaciente.nombre,
    score: apiPaciente.score_social || 0,
    rut: apiPaciente.rut,
    prevision: apiPaciente.prevision_1 || 'N/A',
    edad: apiPaciente.edad,
    sexo: apiPaciente.sexo === 'O' ? 'M' : apiPaciente.sexo, // Mapear 'O' a 'M' como fallback
    hospitalizado: Math.random() > 0.5, // Por ahora aleatorio, ya que no existe en el backend
  }
}