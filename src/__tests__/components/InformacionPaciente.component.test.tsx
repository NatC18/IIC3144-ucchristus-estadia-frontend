import { render, screen } from '@testing-library/react'
import { InformacionPaciente } from '@/components/InformacionPaciente'

describe('InformacionPaciente (component)', () => {
  const mockPaciente = {
    nombre: 'Juan Pérez',
    rut: '12345678-9',
    edad: 45,
    sexo: 'M' as const,
    prevision: 'FONASA',
    score: 80,
    hospitalizado: true,
  }

  it('renders patient information correctly', () => {
    render(<InformacionPaciente {...mockPaciente} />)

    expect(screen.getByText(/Información de paciente Juan Pérez/i)).toBeInTheDocument()
    expect(screen.getByText('12345678-9')).toBeInTheDocument()
    expect(screen.getByText(/45 años/)).toBeInTheDocument()
    expect(screen.getByText('Masculino')).toBeInTheDocument()
    expect(screen.getByText('FONASA')).toBeInTheDocument()
    expect(screen.getByText('80')).toBeInTheDocument()
  })

  it('renders correct hospital status badge', () => {
    render(<InformacionPaciente {...mockPaciente} />)
    const badge = screen.getByText('Hospitalizado')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-blue-100')
  })

  it('renders "Egresado" badge when hospitalizado is false', () => {
    render(<InformacionPaciente {...mockPaciente} hospitalizado={false} />)
    expect(screen.getByText('Egresado')).toBeInTheDocument()
  })
})
