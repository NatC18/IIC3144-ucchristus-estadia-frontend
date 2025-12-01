import { render, screen, fireEvent } from '@testing-library/react'
import { vi, Mock } from 'vitest'
import { ImportStats } from '@/components/ImportStats'
import { useExcelImport } from '@/hooks/useExcelImport'

vi.mock('@/hooks/useExcelImport', () => ({
  useExcelImport: vi.fn(),
}))

describe('ImportStats - Component tests', () => {
  const mockFetchStatus = vi.fn()
  const mockResetStatus = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders error UI when statusError is set', () => {
    ;(useExcelImport as Mock).mockReturnValue({
      isLoadingStatus: false,
      stats: null,
      statusError: 'Network error',
      fetchStatus: mockFetchStatus,
      resetStatus: mockResetStatus,
    })

    render(<ImportStats />)
    expect(screen.getByText(/error al obtener estadísticas/i)).toBeInTheDocument()
    expect(screen.getByText(/network error/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }))
    expect(mockResetStatus).toHaveBeenCalled()
    expect(mockFetchStatus).toHaveBeenCalled()
  })

  it('renders loading skeleton when loading and no stats', () => {
    ;(useExcelImport as Mock).mockReturnValue({
      isLoadingStatus: true,
      stats: null,
      statusError: null,
      fetchStatus: mockFetchStatus,
      resetStatus: mockResetStatus,
    })

    render(<ImportStats />)
    expect(screen.getAllByText('', { selector: '.animate-pulse' }).length).toBeGreaterThan(0)
  })

  it('renders success UI with stats', () => {
    ;(useExcelImport as Mock).mockReturnValue({
      isLoadingStatus: false,
      stats: { pacientes: 10, episodios: 20, gestiones: 30 },
      statusError: null,
      fetchStatus: mockFetchStatus,
      resetStatus: mockResetStatus,
    })

    render(<ImportStats />)
    expect(screen.getByText(/estadísticas de importación/i)).toBeInTheDocument()
    expect(screen.getByText(/total de pacientes en el sistema/i)).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()

    // Resumen total = 60
    expect(screen.getByText('60')).toBeInTheDocument()
  })

  it('renders "no data" UI when stats is null', () => {
    ;(useExcelImport as Mock).mockReturnValue({
      isLoadingStatus: false,
      stats: null,
      statusError: null,
      fetchStatus: mockFetchStatus,
      resetStatus: mockResetStatus,
    })

    render(<ImportStats />)
    expect(screen.getByText(/no hay datos disponibles/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /cargar estadísticas/i }))
    expect(mockFetchStatus).toHaveBeenCalled()
  })
})