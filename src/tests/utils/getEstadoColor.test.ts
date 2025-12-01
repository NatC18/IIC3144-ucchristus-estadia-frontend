import { describe, it, expect } from 'vitest'
import { getEstadoColor } from '@/components/TareasPendientes'

describe('getEstadoColor', () => {
  it('returns correct class for "Abierta"', () => {
    expect(getEstadoColor('Abierta')).toContain('E3AE00')
  })

  it('returns correct class for "En progreso"', () => {
    expect(getEstadoColor('En progreso')).toContain('A31E')
  })

  it('returns correct class for "Completada"', () => {
    expect(getEstadoColor('Completada')).toContain('gray')
  })

  it('returns correct class for "Cancelada"', () => {
    expect(getEstadoColor('Cancelada')).toContain('gray')
  })
})