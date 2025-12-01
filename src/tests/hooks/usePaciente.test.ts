import { renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { usePaciente } from '@/hooks/usePaciente'
import { authService } from '@/services/authService'

// --- Types ---
interface Paciente {
  id: string
  nombre: string
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
describe('usePaciente', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should set loading=false immediately if no id is provided', () => {
    const { result } = renderHook(() => usePaciente(undefined))

    expect(result.current.loading).toBe(false)
    expect(result.current.paciente).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should fetch paciente and set data on success', async () => {
    const mockPaciente: Paciente = { id: '1', nombre: 'Juan Pérez' }

    const mockResponse: MockResponse<Paciente> = {
      ok: true,
      json: async () => mockPaciente,
    }

    mockFetchWithAuth.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => usePaciente('1'))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetchWithAuth).toHaveBeenCalledWith(`${API_BASE_URL}/pacientes/1/`)
    expect(result.current.paciente).toEqual(mockPaciente)
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch errors gracefully', async () => {
    const mockResponse: MockResponse<null> = {
      ok: false,
      status: 500,
      json: async () => null,
    }
    mockFetchWithAuth.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => usePaciente('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.paciente).toBeNull()
    expect(result.current.error).toBe('No se pudo cargar el paciente')
  })

  it('should handle thrown exceptions', async () => {
    mockFetchWithAuth.mockRejectedValueOnce(new Error('Network failure'))

    const { result } = renderHook(() => usePaciente('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.paciente).toBeNull()
    expect(result.current.error).toBe('No se pudo cargar el paciente')
  })
})