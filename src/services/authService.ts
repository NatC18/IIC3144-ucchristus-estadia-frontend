/**
 * Servicio de autenticación JWT para UC Christus
 * Maneja login, logout, registro y gestión de tokens
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

// Interfaces
export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  nombre_completo: string
  rol: 'ADMIN' | 'MEDICO' | 'ENFERMERO' | 'RECEPCION' | 'OTRO'
  is_staff: boolean
  date_joined: string
  last_login: string | null
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface RegisterData {
  email: string
  password: string
  confirm_password: string
  nombre: string
  apellido: string
  rut: string
  rol: 'ADMIN' | 'MEDICO' | 'ENFERMERO' | 'RECEPCION' | 'OTRO'
}

export interface RegisterResponse {
  message: string
  user: User
  tokens: {
    access: string
    refresh: string
  }
}

// Constantes para localStorage
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

class AuthService {
  
  /**
   * Realiza login del usuario
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.error || 'Error en el login')
      }

      const data: LoginResponse = await response.json()
      
      // Guardar tokens y usuario en localStorage
      this.saveTokens(data.access, data.refresh)
      this.saveUser(data.user)
      
      return data
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(Object.values(errorData).flat().join(', ') || 'Error en el registro')
      }

      const data: RegisterResponse = await response.json()
      
      // Guardar tokens y usuario en localStorage
      this.saveTokens(data.tokens.access, data.tokens.refresh)
      this.saveUser(data.user)
      
      return data
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  }

  /**
   * Realiza logout del usuario
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken()
      
      if (refreshToken) {
        // Intentar hacer logout en el backend (blacklist del token)
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAccessToken()}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        })
      }
    } catch (error) {
      console.error('Error en logout del backend:', error)
      // Continuar con logout local aunque falle el backend
    } finally {
      // Limpiar datos locales
      this.clearAuthData()
    }
  }

  /**
   * Renueva el access token usando el refresh token
   */
  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (!response.ok) {
        // Si el refresh token no es válido, hacer logout
        this.clearAuthData()
        throw new Error('Refresh token expired')
      }

      const data = await response.json()
      
      // Guardar nuevo access token
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
      
      // Si viene un nuevo refresh token, guardarlo también
      if (data.refresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)
      }
      
      return data.access
    } catch (error) {
      console.error('Error renovando token:', error)
      this.clearAuthData()
      throw error
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(): Promise<User> {
    try {
      const response = await this.fetchWithAuth(`${API_BASE_URL}/auth/profile/`)
      
      if (!response.ok) {
        throw new Error('Error obteniendo perfil')
      }

      const user: User = await response.json()
      this.saveUser(user) // Actualizar datos locales
      
      return user
    } catch (error) {
      console.error('Error obteniendo perfil:', error)
      throw error
    }
  }

  /**
   * Realiza una petición HTTP con autenticación automática
   */
  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    let accessToken = this.getAccessToken()
    
    if (!accessToken) {
      throw new Error('No access token available')
    }

    // Agregar Authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }

    let response = await fetch(url, {
      ...options,
      headers,
    })

    // Si el token expiró (401), intentar renovarlo
    if (response.status === 401) {
      try {
        accessToken = await this.refreshAccessToken()
        
        // Reintentar la petición con el nuevo token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
      } catch (refreshError) {
        // Si falla el refresh, redirigir al login
        console.error('Error renovando token:', refreshError)
        this.clearAuthData()
        window.location.href = '/login'
        throw new Error('Session expired')
      }
    }

    return response
  }

  // --- Métodos de gestión de tokens y datos locales ---

  /**
   * Guarda los tokens en localStorage
   */
  private saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }

  /**
   * Guarda el usuario en localStorage
   */
  private saveUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  /**
   * Obtiene el access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  /**
   * Obtiene el refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  /**
   * Obtiene el usuario guardado
   */
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!(this.getAccessToken() && this.getUser())
  }

  /**
   * Limpia todos los datos de autenticación
   */
  private clearAuthData(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }


}

// Exportar instancia única del servicio
export const authService = new AuthService()