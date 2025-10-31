
import { getEstadoGestionColor, getHospitalizacionColor } from '@/lib/transformations'

describe('getEstadoGestionColor', () => {
  it('returns green classes when estado is COMPLETADA', () => {
    expect(getEstadoGestionColor('COMPLETADA')).toBe(
      'bg-green-100 text-green-800 rounded-full px-3 py-1'
    )
  })

  it('returns yellow classes when estado is EN_PROGRESO', () => {
    expect(getEstadoGestionColor('EN_PROGRESO')).toBe(
      'bg-yellow-100 text-yellow-800 rounded-full px-3 py-1'
    )
  })

  it('is case-insensitive for estado values', () => {
    expect(getEstadoGestionColor('completada')).toBe(
      'bg-green-100 text-green-800 rounded-full px-3 py-1'
    )
  })

  it('returns gray classes for unknown estado', () => {
    expect(getEstadoGestionColor('DESCONOCIDO')).toBe(
      'bg-gray-100 text-gray-800 rounded-full px-3 py-1'
    )
  })

  it('returns gray classes when estado is empty', () => {
    expect(getEstadoGestionColor('')).toBe(
      'bg-gray-100 text-gray-800 rounded-full px-3 py-1'
    )
  })
})

describe('getHospitalizacionColor', () => {
  it('returns blue classes when hospitalizado is true', () => {
    expect(getHospitalizacionColor(true)).toBe(
      'bg-blue-100 text-blue-800 rounded-full whitespace-nowrap'
    )
  })

  it('returns gray classes when hospitalizado is false', () => {
    expect(getHospitalizacionColor(false)).toBe(
      'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
    )
  })

  it('returns gray classes when hospitalizado is undefined', () => {
    expect(getHospitalizacionColor(undefined as any)).toBe(
      'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
    )
  })
})
