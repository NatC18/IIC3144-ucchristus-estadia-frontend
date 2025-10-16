import { useAuth0 } from '@auth0/auth0-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export function useApi() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }

    try {
      const audience = import.meta.env.VITE_AUTH0_AUDIENCE
      const authorizationParams = audience ? { audience } : {}
      
      const token = await getAccessTokenSilently({
        authorizationParams,
      })
      
      // Only log non-sensitive info in development
      if (import.meta.env.DEV) {
        console.debug('🎫 Auth token acquired', {
          exists: !!token,
          length: token?.length,
        })
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  const makePublicRequest = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Public API request failed:', error)
      throw error
    }
  }

  const get = (endpoint: string) => makeRequest(endpoint)
  
  const post = (endpoint: string, data: unknown) => 
    makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })

  const put = (endpoint: string, data: unknown) => 
    makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })

  const del = (endpoint: string) => 
    makeRequest(endpoint, { method: 'DELETE' })

  // Public methods (no auth required)
  const publicGet = (endpoint: string) => makePublicRequest(endpoint)

  return { get, post, put, del, publicGet }
}