import { describe, it, expect } from 'vitest'

// 👌 Pero lo ideal es exportarla directamente desde el archivo:
import { getEstadoColor } from '@/components/TareasPendientes'

describe('getEstadoColor', () => {
  it('returns correct class for "Abierta"', () => {
    expect(getEstadoColor('Abierta')).toContain('E3AE00')
  })

  it('returns correct class for "En proceso"', () => {
    expect(getEstadoColor('En proceso')).toContain('A31E')
  })

  it('returns correct class for "Cerrada"', () => {
    expect(getEstadoColor('Cerrada')).toContain('gray')
  })
})
