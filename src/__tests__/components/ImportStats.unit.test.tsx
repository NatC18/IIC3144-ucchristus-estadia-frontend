import { render, screen } from '@testing-library/react'
import { vi, Mock } from 'vitest'
import { ImportStats } from '@/components/ImportStats'
import { useExcelImport } from '@/hooks/useExcelImport'

// Mock the hook
vi.mock('@/hooks/useExcelImport', () => ({
  useExcelImport: vi.fn(),
}))

describe('ImportStats - Unit tests', () => {
  const mockFetchStatus = vi.fn()
  const mockResetStatus = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useExcelImport as Mock).mockReturnValue({
      isLoadingStatus: false,
      stats: null,
      statusError: null,
      fetchStatus: mockFetchStatus,
      resetStatus: mockResetStatus,
    })
  })

  it('calls fetchStatus on mount (useEffect)', () => {
    render(<ImportStats />)
    expect(mockFetchStatus).toHaveBeenCalledTimes(1)
  })

  it('calls resetStatus and fetchStatus when clicking refresh', async () => {
    render(<ImportStats />)

    const button = screen.getByRole('button', { name: /actualizar/i })
    button.click()

    expect(mockResetStatus).toHaveBeenCalledTimes(1)
    expect(mockFetchStatus).toHaveBeenCalledTimes(2) // once from mount, once from click
  })

  it('renders with default stats when stats is null', () => {
    render(<ImportStats />)
    expect(screen.getByText(/estadísticas de importación/i)).toBeInTheDocument()
  })
})
