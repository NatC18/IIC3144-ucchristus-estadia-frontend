import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { useGestion, useGestiones } from '@/hooks/useGestiones'

function getEstadoColor(estado: string) {
  switch (estado) {
    case 'INICIADA':
      return 'bg-[#FBF2CC] text-[#E3AE00] rounded-full whitespace-nowrap'
    case 'EN_PROGRESO':
      return 'bg-[#ECEFCF] text-[#8FA31E] rounded-full whitespace-nowrap'
    case 'COMPLETADA':
    case 'CERRADA':
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
    default:
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
  }
}

function getEstadoLabel(estado: string) {
  switch (estado) {
    case 'INICIADA':
      return 'Iniciada'
    case 'EN_PROGRESO':
      return 'En Progreso'
    case 'COMPLETADA':
      return 'Completada'
    case 'CERRADA':
      return 'Cerrada'
    default:
      return estado
  }
}

export function GestionDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const { gestion, loading, error, refetch } = useGestion(id || '')
  
  // Get navigation source from location state
  const from = (location.state as { from?: string, episodioId?: string } | null)
  const isFromEpisodio = from?.from === 'episodio'
  const sourceEpisodioId = from?.episodioId
  const { updateGestion } = useGestiones()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleEstadoChange = async (nuevoEstado: string) => {
    if (!gestion) return
    setIsSaving(true)
    try {
      await updateGestion(gestion.id, { estado_gestion: nuevoEstado as any })
      await refetch()
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating estado:', err)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando gestión...</span>
        </div>
      </div>
    )
  }

  if (error || !gestion) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error al cargar la gestión</span>
          </div>
          <p className="text-gray-600 mb-4">{error || 'No se encontró la gestión solicitada'}</p>
          <Button 
            onClick={() => {
              if (isFromEpisodio && sourceEpisodioId) {
                navigate(`/episodios/${sourceEpisodioId}`)
              } else {
                navigate('/gestiones')
              }
            }}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isFromEpisodio ? 'Volver al Episodio' : 'Volver a Gestiones'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => {
              if (isFromEpisodio && sourceEpisodioId) {
                navigate(`/episodios/${sourceEpisodioId}`)
              } else {
                navigate('/gestiones')
              }
            }}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isFromEpisodio ? 'Volver al Episodio' : 'Volver a Gestiones'}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Detalle de Gestión</h1>
            <p className="text-gray-600">
              {gestion.paciente_nombre ? (
                <>
                  Episodio {gestion.episodio_cmbd} - {gestion.paciente_nombre}
                </>
              ) : (
                <>Episodio {gestion.episodio_cmbd}</>
              )}
            </p>
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
                    <p className="text-base font-semibold text-gray-900">{gestion.episodio_cmbd}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Tipo de Gestión</p>
                    <p className="text-base font-semibold text-gray-900">{gestion.tipo_gestion}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Informe</p>
                  <p className="text-base text-gray-900">{gestion.informe}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Estado Actual</p>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        variant={gestion.estado_gestion === 'INICIADA' ? 'default' : 'outline'}
                        onClick={() => handleEstadoChange('INICIADA')}
                        disabled={isSaving}
                        className={gestion.estado_gestion === 'INICIADA' ? 'bg-[#E3AE00] hover:bg-[#E3AE00]/90' : ''}
                      >
                        Iniciada
                      </Button>
                      <Button
                        variant={gestion.estado_gestion === 'EN_PROGRESO' ? 'default' : 'outline'}
                        onClick={() => handleEstadoChange('EN_PROGRESO')}
                        disabled={isSaving}
                        className={gestion.estado_gestion === 'EN_PROGRESO' ? 'bg-[#8FA31E] hover:bg-[#8FA31E]/90' : ''}
                      >
                        En Progreso
                      </Button>
                      <Button
                        variant={gestion.estado_gestion === 'COMPLETADA' ? 'default' : 'outline'}
                        onClick={() => handleEstadoChange('COMPLETADA')}
                        disabled={isSaving}
                        className={gestion.estado_gestion === 'COMPLETADA' ? 'bg-gray-600 hover:bg-[#d1efcfff]/90' : ''}
                      >
                        Completada
                      </Button>
                      {/* <Button
                        variant={gestion.estado_gestion === 'CERRADA' ? 'default' : 'outline'}
                        onClick={() => handleEstadoChange('CERRADA')}
                        disabled={isSaving}
                        className={gestion.estado_gestion === 'CERRADA' ? 'bg-gray-600 hover:bg-gray-600/90' : ''}
                      >
                        Cerrada
                      </Button> */}
                    </div>
                  ) : (
                    <Badge variant="outline" className={getEstadoColor(gestion.estado_gestion)}>
                      {getEstadoLabel(gestion.estado_gestion)}
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
                        onClick={() => setIsEditing(false)}
                        className="text-white hover:text-white"
                        style={{ backgroundColor: '#671E75' }}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Guardando...
                          </>
                        ) : 'Cancelar'}
                      </Button>
                      
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Historial de Cambios */}
            {/* <Card className="rounded-xl border-0 bg-white">
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
            </Card> */}
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
                  <p className="text-sm font-medium text-gray-600 mb-1">Fecha de Inicio</p>
                  <p className="text-sm text-gray-900">
                    {new Date(gestion.fecha_inicio).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {gestion.fecha_fin && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Fecha de Término</p>
                    <p className="text-sm text-gray-900">
                      {new Date(gestion.fecha_fin).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Creación</p>
                  <p className="text-sm text-gray-900">
                    {new Date(gestion.created_at).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Última actualización</p>
                  <p className="text-sm text-gray-900">
                    {new Date(gestion.updated_at).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {gestion.usuario && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Responsable</p>
                    <p className="text-sm text-gray-900">{gestion.usuario_nombre}</p>
                  </div>
                )}
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
