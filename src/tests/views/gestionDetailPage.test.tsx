import { render, screen } from '@testing-library/react'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import { GestionDetailPage } from '@/pages/GestionDetailPage'
import { BrowserRouter } from 'react-router-dom'

// ---- MOCKS ----

// Create variables we can override in tests
const mockUseGestion = vi.fn()
const mockUseGestiones = vi.fn(() => ({
  updateGestion: vi.fn(),
}))

const mockUseNotas = vi.fn(() => ({
  createNota: vi.fn(),
  updateNota: vi.fn(),
  deleteNota: vi.fn(),
  loadingNotas: false,
}))

// Apply mocks
vi.mock('@/hooks/useGestiones', () => ({
  useGestion: () => mockUseGestion(),
  useGestiones: () => mockUseGestiones(),
}))

vi.mock('@/hooks/useEnfermeros', () => ({
  useEnfermeros: () => ({ enfermeros: [], loading: false }),
}))

vi.mock('@/hooks/useNotas', () => ({
  useNotas: () => mockUseNotas(),
}))

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-1' } }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')

  return {
    ...actual,
    useParams: () => ({ id: '123' }),
    useNavigate: () => vi.fn(),
    useLocation: () => ({ state: null }),
  }
})


// Render helper
function renderPage() {
  return render(
    <BrowserRouter>
      <GestionDetailPage />
    </BrowserRouter>
  )
}

// ---- TESTS ----

describe('GestionDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    mockUseGestion.mockReturnValue({
      loading: true,
      error: null,
      gestion: null,
    })

    renderPage()

    expect(screen.getByText(/Cargando gestión/i)).toBeInTheDocument()
  })

  it('shows error state', () => {
    mockUseGestion.mockReturnValue({
      loading: false,
      error: 'Something went wrong',
      gestion: null,
    })

    renderPage()

    expect(screen.getByText(/Error al cargar la gestión/i)).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
  })

  it('renders gestion details', () => {
    mockUseGestion.mockReturnValue({
      loading: false,
      error: null,
      gestion: {
        id: '123',
        episodio_cmbd: 'EP001',
        paciente_nombre: 'Juan Pérez',
        tipo_gestion: 'Visita',
        informe: 'Texto del informe',
        estado_gestion: 'INICIADA',
      },
      refetch: vi.fn(),
    })

    renderPage()

    expect(screen.getByText('Detalle de Gestión')).toBeInTheDocument()
    expect(screen.getAllByText(/EP001/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument()
    expect(screen.getByText(/Visita/i)).toBeInTheDocument()
  })
})
