import { PacienteAPI } from '../hooks/usePacientes'

// Interfaz que usa el frontend (mantenemos la original del mockData)
export interface Paciente {
  id: number | string
  nombre: string
  score: number
  rut: string
  prevision: string
  edad: number
  sexo: 'M' | 'F'
  hospitalizado: boolean
}

// Función para convertir datos del backend al formato del frontend
export function mapPacienteFromAPI(apiPaciente: PacienteAPI): Paciente {
  return {
    id: apiPaciente.id,
    nombre: apiPaciente.nombre,
    score: apiPaciente.score_social || 0,
    rut: apiPaciente.rut,
    prevision: apiPaciente.prevision_1,
    edad: apiPaciente.edad,
    sexo: apiPaciente.sexo === 'O' ? 'M' : apiPaciente.sexo, // Mapear 'O' a 'M' como fallback
    hospitalizado: Math.random() > 0.5, // Por ahora aleatorio, ya que no existe en el backend
  }
}