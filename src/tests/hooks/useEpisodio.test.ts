import { renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useEpisodio } from '@/hooks/useEpisodio'
import { authService } from '@/services/authService'

// --- Types ---
interface Episodio {
  id: string
  titulo: string
}

interface MockResponse<T> {
  ok: boolean
  status?: number
  json: () => Promise<T>
}

// --- Mock authService ---
vi.mock('@/services/authService', () => ({
  authService: {
    fetchWithAuth: vi.fn(),
  },
}))

const mockFetchWithAuth = authService.fetchWithAuth as unknown as ReturnType<typeof vi.fn>

// --- Constants ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

// --- Tests ---
describe('useEpisodio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not fetch if no id is provided', () => {
    const { result } = renderHook(() => useEpisodio(undefined))

    expect(result.current.loading).toBe(true)
    expect(result.current.episodio).toBeNull()
    expect(result.current.error).toBeNull()
    expect(mockFetchWithAuth).not.toHaveBeenCalled()
  })

  it('should fetch episodio and set data on success', async () => {
    const mockEpisodio: Episodio = { id: '1', titulo: 'Episodio piloto' }

    // Simulate a successful fetch
    const mockResponse: MockResponse<Episodio> = {
      ok: true,
      json: async () => mockEpisodio,
    }
    mockFetchWithAuth.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useEpisodio('1'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetchWithAuth).toHaveBeenCalledWith(`${API_BASE_URL}/episodios/1/`)
    expect(result.current.episodio).toEqual(mockEpisodio)
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch errors gracefully', async () => {
    const mockResponse: MockResponse<null> = {
      ok: false,
      status: 500,
      json: async () => null,
    }
    mockFetchWithAuth.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useEpisodio('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.episodio).toBeNull()
    expect(result.current.error).toBe('No se pudo cargar el episodio')
  })

  it('should handle thrown exceptions', async () => {
    mockFetchWithAuth.mockRejectedValueOnce(new Error('Network failure'))

    const { result } = renderHook(() => useEpisodio('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.episodio).toBeNull()
    expect(result.current.error).toBe('No se pudo cargar el episodio')
  })
})