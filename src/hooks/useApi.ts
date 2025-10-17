import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email?: string
    first_name?: string
    last_name?: string
  }
}

export function useApi() {
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem('authToken')
  )

  // Función para hacer peticiones autenticadas
  const makeRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    }

    // Agregar token de autenticación si existe
    if (authToken) {
      headers['Authorization'] = `Token ${authToken}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // Función para hacer peticiones públicas (sin autenticación)
  const makePublicRequest = async <T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  // Función de login
  const login = async (username: string, password: string) => {
    try {
      const response = await makePublicRequest<LoginResponse>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })

      setAuthToken(response.token)
      localStorage.setItem('authToken', response.token)
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      if (authToken) {
        await makeRequest('/auth/logout/', {
          method: 'POST',
        })
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setAuthToken(null)
      localStorage.removeItem('authToken')
    }
  }

  // Métodos HTTP con autenticación
  const get = <T>(endpoint: string) => makeRequest<T>(endpoint)
  const post = <T>(endpoint: string, data: unknown) => 
    makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  const put = <T>(endpoint: string, data: unknown) => 
    makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  const del = <T>(endpoint: string) => 
    makeRequest<T>(endpoint, { method: 'DELETE' })

  // Métodos HTTP públicos (sin autenticación)
  const publicGet = <T>(endpoint: string) => makePublicRequest<T>(endpoint)
  const publicPost = <T>(endpoint: string, data: unknown) => 
    makePublicRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })

  return {
    // Métodos autenticados
    get,
    post,
    put,
    del,
    
    // Métodos públicos
    publicGet,
    publicPost,
    
    // Autenticación
    login,
    logout,
    
    // Estado
    authToken,
    isAuthenticated: !!authToken,
    
    // Función genérica (para casos especiales)
    makeRequest,
    makePublicRequest,
  }
}