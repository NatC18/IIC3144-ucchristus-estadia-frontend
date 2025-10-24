import type { Episodio as EpisodioAPI, Cama } from '@/types'

// Interfaz para episodio con fechas como objetos Date (para uso en componentes)
export interface Episodio {
  id: string
  paciente: string
  cama?: Cama | null
  episodio_cmbd: number
  fecha_ingreso: Date
  fecha_egreso: Date | null
  tipo_actividad: string
  inlier_outlier_flag?: string | null
  especialidad?: string | null
  estancia_prequirurgica?: number | null
  estancia_postquirurgica?: number | null
  estancia_norma_grd?: number | null
  estancia_dias: number
  created_at: Date
  updated_at: Date
}

// Función para mapear datos del API al formato del frontend con fechas como Date
export function mapEpisodioFromAPI(apiEpisodio: EpisodioAPI): Episodio {
  return {
    id: apiEpisodio.id,
    paciente: apiEpisodio.paciente,
    cama: apiEpisodio.cama,
    episodio_cmbd: apiEpisodio.episodio_cmbd,
    fecha_ingreso: new Date(apiEpisodio.fecha_ingreso),
    fecha_egreso: apiEpisodio.fecha_egreso ? new Date(apiEpisodio.fecha_egreso) : null,
    tipo_actividad: apiEpisodio.tipo_actividad,
    inlier_outlier_flag: apiEpisodio.inlier_outlier_flag,
    especialidad: apiEpisodio.especialidad,
    estancia_prequirurgica: apiEpisodio.estancia_prequirurgica,
    estancia_postquirurgica: apiEpisodio.estancia_postquirurgica,
    estancia_norma_grd: apiEpisodio.estancia_norma_grd,
    estancia_dias: apiEpisodio.estancia_dias,
    created_at: new Date(apiEpisodio.created_at),
    updated_at: new Date(apiEpisodio.updated_at),
  }
}