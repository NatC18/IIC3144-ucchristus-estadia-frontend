import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { GestionesPage } from './pages/GestionesPage'
import { CreateGestionPage } from './pages/CreateGestionPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/gestiones" element={<GestionesPage />} />
        <Route path="/gestiones/create" element={<CreateGestionPage />} />
      </Routes>
    </Router>
  )
}

export default App
