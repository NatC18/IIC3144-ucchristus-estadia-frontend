import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { GestionesPage } from './pages/GestionesPage'
import { CreateGestionPage } from './pages/CreateGestionPage'
import { GestionDetailPage } from './pages/GestionDetailPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { PacientesPage } from './pages/PacientesPage'
import { PacienteDetailPage } from './pages/PacienteDetailPage'
import { CallbackPage } from './pages/CallbackPage'
import { PrivateRoute } from './components/PrivateRoute'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path="/gestiones" element={
          <PrivateRoute>
            <GestionesPage />
          </PrivateRoute>
        } />
        <Route path="/gestiones/create" element={
          <PrivateRoute>
            <CreateGestionPage />
          </PrivateRoute>
        } />
        <Route path="/gestiones/:id" element={
          <PrivateRoute>
            <GestionDetailPage />
          </PrivateRoute>
        } />
        <Route path="/pacientes" element={
          <PrivateRoute>
            <PacientesPage />
          </PrivateRoute>
        } />
        <Route path="/pacientes/:id" element={
          <PrivateRoute>
            <PacienteDetailPage />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />

      </Routes>
    </Router>
  )
}

export default App
