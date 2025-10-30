import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { InformacionPaciente } from '@/components/InformacionPaciente'
import { getHospitalizacionColor } from '@/lib/transformations'

vi.mock('@/lib/transformations', () => ({
  getHospitalizacionColor: vi.fn(() => 'bg-green-100'),
}))

describe('InformacionPaciente', () => {
  const basePaciente = {
    nombre: 'Juan Pérez',
    rut: '11.111.111-1',
    edad: 45,
    sexo: 'M' as const, // ✅ "M" is now treated as a literal type
    prevision: 'Fonasa',
    score: 85,
    hospitalizado: true,
  }

  it('renders patient information correctly', () => {
    render(<InformacionPaciente {...basePaciente} />)

    expect(screen.getByText(/Información de paciente Juan Pérez/i)).toBeInTheDocument()
    expect(screen.getByText('11.111.111-1')).toBeInTheDocument()
    expect(screen.getByText('45 años')).toBeInTheDocument()
    expect(screen.getByText('Masculino')).toBeInTheDocument()
    expect(screen.getByText('Fonasa')).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument()
  })

  it('shows "Hospitalizado" badge when hospitalizado is true', () => {
    render(<InformacionPaciente {...basePaciente} />)
    expect(screen.getByText('Hospitalizado')).toBeInTheDocument()
  })

  it('shows "Egresado" badge when hospitalizado is false', () => {
    render(<InformacionPaciente {...basePaciente} hospitalizado={false} />)
    expect(screen.getByText('Egresado')).toBeInTheDocument()
  })

  it('calls getHospitalizacionColor with the correct value', () => {
    render(<InformacionPaciente {...basePaciente} />)
    expect(getHospitalizacionColor).toHaveBeenCalledWith(true)
  })

  it('renders "Femenino" when sexo is F', () => {
    render(<InformacionPaciente {...basePaciente} sexo={'F' as const} />) // ✅ also mark as literal
    expect(screen.getByText('Femenino')).toBeInTheDocument()
  })
})
