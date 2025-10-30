/**
 * Contexto de autenticación para UC Christus
 * Maneja el estado global de autenticación en la aplicación
 */

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { authService, User } from '@/services/authService'

// Tipos del contexto
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (userData: {
    email: string
    password: string
    confirm_password: string
    nombre: string
    apellido: string
    rut: string
    rol: 'ADMIN' | 'MEDICO' | 'ENFERMERO' | 'RECEPCION' | 'OTRO'
  }) => Promise<void>
  clearError: () => void
  refreshProfile: () => Promise<void>
}

// Acciones del reducer
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Iniciar con loading true para verificar autenticación
  error: null,
}

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    
    default:
      return state
  }
}

// Crear contextos
const AuthContext = createContext<AuthContextType | null>(null)

// Hook para usar el contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

// Props del provider
interface AuthProviderProps {
  children: ReactNode
}

// Provider del contexto
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay tokens guardados
        if (authService.isAuthenticated()) {
          // Intentar obtener el perfil del usuario para validar el token
          const user = await authService.getProfile()
          dispatch({ type: 'AUTH_SUCCESS', payload: user })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        // Si hay error, limpiar datos de autenticación
        await authService.logout()
        dispatch({ type: 'AUTH_FAILURE', payload: 'Sesión expirada' })
      }
    }

    checkAuth()
  }, [])

  // Función de login
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' })
      
      const response = await authService.login(email, password)
      
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el login'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  // Función de registro
  const register = async (userData: {
    email: string
    password: string
    confirm_password: string
    nombre: string
    apellido: string
    rut: string
    rol: 'ADMIN' | 'MEDICO' | 'ENFERMERO' | 'RECEPCION' | 'OTRO'
  }) => {
    try {
      dispatch({ type: 'AUTH_START' })
      
      const response = await authService.register(userData)
      
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro'
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage })
      throw error
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      await authService.logout()
      dispatch({ type: 'AUTH_LOGOUT' })
    } catch (error) {
      console.error('Error en logout:', error)
      // Hacer logout local aunque falle el backend
      dispatch({ type: 'AUTH_LOGOUT' })
    }
  }

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Función para refrescar el perfil
  const refreshProfile = async () => {
    try {
      const user = await authService.getProfile()
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
    } catch (error) {
      console.error('Error refrescando perfil:', error)
      // Si falla, hacer logout
      await logout()
    }
  }

  // Valor del contexto
  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    clearError,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Componente de carga para mostrar mientras se verifica la autenticación
export function AuthLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#671E75] mx-auto"></div>
        <p className="mt-4 text-gray-600">Verificando autenticación...</p>
      </div>
    </div>
  )
}