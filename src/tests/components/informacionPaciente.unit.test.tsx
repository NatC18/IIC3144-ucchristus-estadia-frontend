import { render, screen } from '@testing-library/react'
import { InformacionPaciente } from '@/components/InformacionPaciente'
import * as transformations from '@/lib/transformations'

describe('InformacionPaciente (unit)', () => {
  it('calls getHospitalizacionColor with correct value', () => {
    const spy = vi.spyOn(transformations, 'getHospitalizacionColor')
    render(
      <InformacionPaciente
        nombre="Juan Pérez"
        rut="12345678-9"
        edad={45}
        sexo="M"
        prevision="FONASA"
        score={80}
        hospitalizado={true}
      />
    )

    expect(spy).toHaveBeenCalledWith(true)
  })

  it('renders "Masculino" when sexo is M', () => {
    render(
      <InformacionPaciente
        nombre="Juan Pérez"
        rut="12345678-9"
        edad={45}
        sexo="M"
        prevision="FONASA"
        score={80}
        hospitalizado={false}
      />
    )

    expect(screen.getByText('Masculino')).toBeInTheDocument()
  })

  it('renders "Femenino" when sexo is F', () => {
    render(
      <InformacionPaciente
        nombre="Ana Gómez"
        rut="98765432-1"
        edad={30}
        sexo="F"
        prevision="ISAPRE"
        score={95}
        hospitalizado={false}
      />
    )

    expect(screen.getByText('Femenino')).toBeInTheDocument()
  })
})
