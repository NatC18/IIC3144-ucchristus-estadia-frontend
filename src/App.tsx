import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { GestionesPage } from './pages/GestionesPage'
import { CreateGestionPage } from './pages/CreateGestionPage'
import { GestionDetailPage } from './pages/GestionDetailPage'
import { EpisodiosPage } from './pages/EpisodiosPage'
// import { CreateEpisodioPage } from './pages/CreateEpisodioPage'
import { EpisodioDetailPage } from './pages/EpisodioDetailPage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { PacientesPage } from './pages/PacientesPage'
import { PacienteDetailPage } from './pages/PacienteDetailPage'
import { ExcelManagementPage } from './pages/ExcelManagement'
import { PrivateRoute } from './components/PrivateRoute'
// import { AdminPage } from './pages/AdminPage'
import AdminPage from "@/pages/AdminPage"


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
        <Route path="/episodios" element={
          <PrivateRoute>
            <EpisodiosPage />
          </PrivateRoute>
        } />
        {/* <Route path="/episodios/create" element={
          <PrivateRoute>
            <CreateGestionPage />
          </PrivateRoute>
        } /> */}
        <Route path="/episodios/:id" element={
          <PrivateRoute>
            <EpisodioDetailPage />
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
        <Route path="/excel-management" element={
          <PrivateRoute>
            <ExcelManagementPage />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>        
        } />


      </Routes>
    </Router>
  )
}

export default App
