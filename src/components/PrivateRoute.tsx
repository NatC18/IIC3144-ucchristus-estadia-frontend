import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AuthLoadingSpinner } from '@/contexts/AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Mostrar spinner mientras se verifica la autenticación
  if (isLoading) {
    return <AuthLoadingSpinner />
  }

  // Si no está autenticado, redirigir al login con la ubicación actual
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    )
  }

  // Si está autenticado, mostrar el componente
  return <>{children}</>
}