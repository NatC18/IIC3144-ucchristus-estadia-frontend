import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { tareasPendientes, type TareaPendiente } from '@/data/mockData'

function getEstadoColor(estado: TareaPendiente['estado']) {
  switch (estado) {
    case 'Abierta':
      return 'bg-[#FBF2CC] text-[#E3AE00] rounded-full whitespace-nowrap'
    case 'En proceso':
      return 'bg-[#ECEFCF] text-[#8FA31E] rounded-full whitespace-nowrap'
    case 'Cerrada':
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
    default:
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
  }
}

export function GestionDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const tareaIndex = parseInt(id || '0')
  const tareaInicial = tareasPendientes[tareaIndex] || tareasPendientes[0]
  
  const [tarea, setTarea] = useState<TareaPendiente>(tareaInicial)
  const [isEditing, setIsEditing] = useState(false)

  const handleEstadoChange = (nuevoEstado: TareaPendiente['estado']) => {
    setTarea({ ...tarea, estado: nuevoEstado })
  }

  const handleSave = () => {
    setIsEditing(false)
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Detalle de Gestión</h1>
            <p className="text-gray-600">Episodio {tarea.episodio}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de la Gestión */}
            <Card className="rounded-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Información de la Gestión</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Episodio</p>
                    <p className="text-base font-semibold text-gray-900">{tarea.episodio}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Tipo de Barrera</p>
                    <p className="text-base text-gray-900">{tarea.tipoBarrera}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Descripción</p>
                  <p className="text-base text-gray-900">{tarea.descripcion}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Estado Actual</p>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        variant={tarea.estado === 'Abierta' ? 'default' : 'outline'}
                        onClick={() => handleEstadoChange('Abierta')}
                        className={tarea.estado === 'Abierta' ? 'bg-[#E3AE00] hover:bg-[#E3AE00]/90' : ''}
                      >
                        Abierta
                      </Button>
                      <Button
                        variant={tarea.estado === 'En proceso' ? 'default' : 'outline'}
                        onClick={() => handleEstadoChange('En proceso')}
                        className={tarea.estado === 'En proceso' ? 'bg-[#8FA31E] hover:bg-[#8FA31E]/90' : ''}
                      >
                        En proceso
                      </Button>
                      <Button
                        variant={tarea.estado === 'Cerrada' ? 'default' : 'outline'}
                        onClick={() => handleEstadoChange('Cerrada')}
                        className={tarea.estado === 'Cerrada' ? 'bg-gray-600 hover:bg-gray-600/90' : ''}
                      >
                        Cerrada
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline" className={getEstadoColor(tarea.estado)}>
                      {tarea.estado}
                    </Badge>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="pt-4">
                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="text-white hover:text-white"
                      style={{ backgroundColor: '#671E75' }}
                    >
                      Editar Estado
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSave}
                        className="text-white hover:text-white"
                        style={{ backgroundColor: '#671E75' }}
                      >
                        Guardar Cambios
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setTarea(tareaInicial)
                          setIsEditing(false)
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Historial de Cambios */}
            <Card className="rounded-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Historial de Cambios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-[#f3e8ff] rounded-lg h-fit">
                      <svg className="w-4 h-4" style={{ color: '#671E75' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Gestión creada</p>
                      <p className="text-xs text-gray-600 mt-1">Hace 2 días</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-[#FBF2CC] rounded-lg h-fit">
                      <svg className="w-4 h-4" style={{ color: '#E3AE00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Estado actualizado a "Abierta"</p>
                      <p className="text-xs text-gray-600 mt-1">Hace 1 día</p>
                    </div>
                  </div>

                  <div className="text-center py-4 text-gray-500 text-sm">
                    No hay más cambios registrados
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información Adicional */}
            <Card className="rounded-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Información Adicional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Fecha de creación</p>
                  <p className="text-sm text-gray-900">15 Oct 2025</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Última actualización</p>
                  <p className="text-sm text-gray-900">Hace 2 horas</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Responsable</p>
                  <p className="text-sm text-gray-900">Equipo de Gestión</p>
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card className="rounded-xl border-0 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p>Puedes cambiar el estado de la gestión haciendo clic en "Editar Estado" y seleccionando una de las opciones disponibles.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
