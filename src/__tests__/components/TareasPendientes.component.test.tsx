import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TareasPendientes, type TareaPendiente } from '@/components/TareasPendientes'

export const mockTareas: TareaPendiente[] = [
  {
    id: '1',
    episodio: 'Episodio 1',
    tipo_gestion: 'Traspaso',
    descripcion: 'Revisar informe clínico',
    estado: 'Abierta',
    fecha_inicio: '2025-10-30',
  },
]

export const mockMultipleTareas: TareaPendiente[] = [
  {
    id: '1',
    episodio: 'Episodio 1',
    tipo_gestion: 'Traspaso',
    descripcion: 'Revisar informe clínico',
    estado: 'Abierta',
    fecha_inicio: '2025-10-30',
  },
  {
    id: '2',
    episodio: 'Episodio 2',
    tipo_gestion: 'Control',
    descripcion: 'Llamar al paciente',
    estado: 'Abierta',
    fecha_inicio: '2025-11-01',
  }, 
]

describe('TareasPendientes', () => {
  it('renders loading state', () => {
    render(<TareasPendientes tareas={[]} loading={true} />)
    expect(screen.getByText('Cargando tareas...')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<TareasPendientes tareas={[]} />)
    expect(screen.getByText('No hay tareas pendientes')).toBeInTheDocument()
  })

  it('renders a table when tareas are provided', () => {
    render(<TareasPendientes tareas={mockTareas} />)
    expect(screen.getByText('Episodio 1')).toBeInTheDocument()
    expect(screen.getByText('Traspaso')).toBeInTheDocument()
    expect(screen.getByText('Revisar informe clínico')).toBeInTheDocument()
  })

  it('formats date as dd-mm-yyyy', () => {
    render(<TareasPendientes tareas={mockTareas} />)
    const dateCell = screen.getByText(/\d{2}-\d{2}-\d{4}/)
    expect(dateCell).toBeInTheDocument()
  })

  it('applies correct color class for estado', () => {
    render(<TareasPendientes tareas={mockTareas} />)
    const badge = screen.getByText('Abierta')
    expect(badge.className).toContain('E3AE00')
  })

  it('renders two rows with tareas', () => {
    render(<TareasPendientes tareas={mockMultipleTareas} />)

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(3) // 1 header + 2 data rows
    const badges = screen.getAllByText('Abierta')
    expect(badges[0].className).toContain('E3AE00')
    expect(badges[1].className).toContain('E3AE00')
  })
})
