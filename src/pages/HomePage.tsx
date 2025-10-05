import { Navigate } from 'react-router-dom'

export default function HomePage() {
  // Redirige '/' a '/dashboard'
  return <Navigate to="/dashboard" replace />
}
