import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

export function CreateGestionPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    episodio: '',
    tipoBarrera: 'Social',
    descripcion: '',
    estado: 'Abierta' as 'Abierta' | 'En proceso' | 'Cerrada',
    paciente: '',
    fechaCreacion: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle task creation (e.g., send to API)
    console.log('Nueva gestión creada:', formData)
    // Navigate back to gestiones page after creation
    navigate('/gestiones')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/gestiones')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Gestiones
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Gestión</h1>
          <p className="text-gray-600">Crear una nueva tarea o barrera hospitalaria</p>
        </div>

        {/* Form Card */}
        <Card className="rounded-xl border-0 max-w-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Información de la Gestión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Episodio */}
              <div>
                <label htmlFor="episodio" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Episodio <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="episodio"
                  name="episodio"
                  required
                  value={formData.episodio}
                  onChange={handleChange}
                  placeholder="Ej: 126823993"
                  className="w-full"
                />
              </div>

              {/* Paciente */}
              <div>
                <label htmlFor="paciente" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Paciente <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="paciente"
                  name="paciente"
                  required
                  value={formData.paciente}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  className="w-full"
                />
              </div>

              {/* Tipo de Barrera */}
              <div>
                <label htmlFor="tipoBarrera" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Barrera <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipoBarrera"
                  name="tipoBarrera"
                  required
                  value={formData.tipoBarrera}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent"
                >
                  <option value="Social">Social</option>
                  <option value="Administrativa">Administrativa</option>
                  <option value="Clínica">Clínica</option>
                  <option value="Técnica">Técnica</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  required
                  rows={4}
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe la situación o tarea a realizar..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent"
                />
              </div>

              {/* Estado */}
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado Inicial <span className="text-red-500">*</span>
                </label>
                <select
                  id="estado"
                  name="estado"
                  required
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent"
                >
                  <option value="Abierta">Abierta</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Cerrada">Cerrada</option>
                </select>
              </div>

              {/* Fecha de Creación */}
              <div>
                <label htmlFor="fechaCreacion" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Creación <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  id="fechaCreacion"
                  name="fechaCreacion"
                  required
                  value={formData.fechaCreacion}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1"
                  style={{ backgroundColor: '#671E75' }}
                >
                  Crear Gestión
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/gestiones')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="rounded-xl border-0 max-w-3xl mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Información importante</p>
                <p>Las gestiones creadas quedarán registradas y serán visibles para todo el equipo de gestión hospitalaria. Asegúrate de completar toda la información necesaria.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
