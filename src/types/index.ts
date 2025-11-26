/**
 * Tipos centralizados para el proyecto UC Christus
 * Basados en los modelos y serializers del backend Django
 */

// ==================== CAMA ====================

export interface Cama {
  id: string
  codigo_cama: string
  habitacion: string
}

// ==================== EPISODIO ====================

export interface Episodio {
  id: string
  paciente: string
  cama?: Cama | null
  episodio_cmbd: number
  fecha_ingreso: string
  fecha_egreso: string | null
  tipo_actividad: string
  inlier_outlier_flag?: string | null
  especialidad?: string | null
  estancia_prequirurgica?: number | null
  estancia_postquirurgica?: number | null
  estancia_norma_grd?: number | null
  estancia_dias: number
  created_at: string
  updated_at: string
}

// ==================== PACIENTE ====================

export type SexoPaciente = 'M' | 'F' | 'O'

export interface Paciente {
  id: string
  rut: string
  nombre: string
  sexo: SexoPaciente
  fecha_nacimiento: string
  edad: number
  prevision_1?: string | null
  prevision_2?: string | null
  convenio?: string | null
  score_social?: number | null
  created_at: string
  updated_at: string
}

export interface PacienteDetail extends Paciente {
  episodios: Episodio[]
}

// ==================== HISTORIAL ====================

export interface PacienteHistorial {
  paciente_id: string
  paciente_nombre: string
  historial: unknown[] // Placeholder para futuras implementaciones
  message: string
}

// ==================== ESTADÍSTICAS ====================

export interface PacienteEstadisticas {
  total_episodios: number
  episodios_activos: number
  episodios_cerrados: number
  estancia_promedio: number
}

export interface EpisodioEstadisticas {
  total_episodios: number
  episodios_activos: number
  episodios_egresados: number
  promedio_estadia_dias: number
  extensiones_criticas: number
  altas_hoy: number
}

// ==================== NOTAS ====================

export interface Nota {
  id: string
  gestion: string
  usuario?: string | null
  usuario_nombre?: string
  descripcion: string
  fecha_nota: string
  estado: string
}

// ==================== RESPUESTAS PAGINADAS ====================

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// ==================== INFORMACION SERVICIO ====================

export interface InformacionServicio {
  codigo: string
  descripcion: string,
  id: string
}

// ==================== SERVICIO ====================

export interface Servicio {
  id: string
  episodio: string
  descripcion: string
  tipo: string
  fecha: string
  servicio: InformacionServicio
}

