import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { GestionesPage } from './pages/GestionesPage'
import { CreateGestionPage } from './pages/CreateGestionPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { PacientesPage } from './pages/PacientesPage'
import { PacienteDetailPage } from './pages/PacienteDetailPage'
import { PrivateRoute } from './components/PrivateRoute'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/gestiones" element={<GestionesPage />} />
        <Route path="/gestiones/create" element={<CreateGestionPage />} />
        <Route path="/pacientes" element={<PacientesPage />} />
        <Route path="/pacientes/:id" element={<PacienteDetailPage />} />
        <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  )
}

export default App
