import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, AlertCircle, AlertTriangle } from 'lucide-react'
import { Gestion, useGestion, useGestiones } from '@/hooks/useGestiones'
import { useEnfermeros } from '@/hooks/useEnfermeros'
import { useNotas } from '@/hooks/useNotas'
import { NotasCard } from '@/components/NotasCard'
import { useAuth } from '@/contexts/AuthContext'
import { 
  estadosTransfer, 
  motivoRechazoTraslado, 
  motivoCancelacionTraslado 
} from '@/data/destinos'

function getEstadoColor(estado: string) {
  switch (estado) {
    case 'INICIADA':
      return 'bg-[#FBF2CC] text-[#E3AE00] rounded-full whitespace-nowrap'
    case 'EN_PROGRESO':
      return 'bg-[#ECEFCF] text-[#8FA31E] rounded-full whitespace-nowrap'
    case 'COMPLETADA':
      return 'bg-[#D1FAE5] text-[#059669] rounded-full whitespace-nowrap'
    case 'CANCELADA':
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
    case 'CANCELADA':
      return 'Cancelada'
    default:
      return estado
  }
}

// Get allowed transitions for each estado
function getAllowedTransitions(currentEstado: Gestion['estado_gestion']): Gestion['estado_gestion'][] {
  switch (currentEstado) {
    case 'INICIADA':
      return ['EN_PROGRESO', 'COMPLETADA', 'CANCELADA']
    case 'EN_PROGRESO':
      return ['COMPLETADA', 'CANCELADA']
    case 'COMPLETADA':
      return [] // No transitions allowed
    case 'CANCELADA':
      return [] // No transitions allowed
    default:
      return []
  }
}

export function GestionDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const { user } = useAuth()
  const { gestion, loading, error, refetch } = useGestion(id || '')
  
  // Get navigation source from location state
  const from = (location.state as { from?: string, episodioId?: string } | null)
  const isFromEpisodio = from?.from === 'episodio'
  const sourceEpisodioId = from?.episodioId
  const { updateGestion } = useGestiones()
  const { enfermeros, loading: loadingEnfermeros } = useEnfermeros()
  const { createNota, updateNota, deleteNota, loading: loadingNotas } = useNotas()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingAsignado, setIsEditingAsignado] = useState(false)
  const [isEditingTraslado, setIsEditingTraslado] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingEstadoChange, setPendingEstadoChange] = useState<Gestion['estado_gestion'] | null>(null)
  const [showEstadoConfirmation, setShowEstadoConfirmation] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [trasladoForm, setTrasladoForm] = useState({
    estado_traslado: '',
    motivo_rechazo: '',
    motivo_cancelacion: '',
  })

  const handleEstadoChange = (nuevoEstado: Gestion['estado_gestion']) => {
    setPendingEstadoChange(nuevoEstado)
    setUpdateError(null)
    setShowEstadoConfirmation(true)
  }

  const confirmEstadoChange = async () => {
    if (!gestion || !pendingEstadoChange) return
    setIsSaving(true)
    setUpdateError(null)
    try {
      const updateData: Record<string, string> = { estado_gestion: pendingEstadoChange }
      
      // Set fecha_fin when completing the gestion
      if (pendingEstadoChange === 'COMPLETADA') {
        updateData.fecha_fin = new Date().toISOString()
      }
      
      await updateGestion(gestion.id, updateData)
      await refetch()
      setIsEditing(false)
      setShowEstadoConfirmation(false)
      setPendingEstadoChange(null)
    } catch (err) {
      console.error('Error updating estado:', err)
      setUpdateError(err instanceof Error ? err.message : 'Error al actualizar el estado')
    } finally {
      setIsSaving(false)
    }
  }

  const cancelEstadoChange = () => {
    setShowEstadoConfirmation(false)
    setPendingEstadoChange(null)
  }

  const handleUsuarioChange = async (nuevoUsuario: string) => {
    if (!gestion) return
    setIsSaving(true)
    try {
      await updateGestion(gestion.id, { usuario: nuevoUsuario })
      await refetch()
      setIsEditingAsignado(false)
    } catch (err) {
      console.error('Error updating usuario:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTrasladoChange = async () => {
    if (!gestion) return
    
    // Validate required motivo fields
    if (trasladoForm.estado_traslado === 'CANCELADO' && !trasladoForm.motivo_cancelacion) {
      console.error('Motivo de cancelación es requerido')
      return
    }
    if (trasladoForm.estado_traslado === 'RECHAZADO' && !trasladoForm.motivo_rechazo) {
      console.error('Motivo de rechazo es requerido')
      return
    }
    
    setIsSaving(true)
    try {
      const updateData: Record<string, string> = {
        estado_traslado: trasladoForm.estado_traslado,
      }

      if (trasladoForm.estado_traslado === 'CANCELADO' && trasladoForm.motivo_cancelacion) {
        updateData.motivo_cancelacion_traslado = trasladoForm.motivo_cancelacion
      } else if (trasladoForm.estado_traslado === 'RECHAZADO' && trasladoForm.motivo_rechazo) {
        updateData.motivo_rechazo_traslado = trasladoForm.motivo_rechazo
      }

      await updateGestion(gestion.id, updateData)
      await refetch()
      setIsEditingTraslado(false)
      setTrasladoForm({ estado_traslado: '', motivo_rechazo: '', motivo_cancelacion: '' })
    } catch (err) {
      console.error('Error updating traslado:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const openTrasladoEdit = () => {
    if (gestion) {
      setTrasladoForm({
        estado_traslado: gestion.estado_traslado || '',
        motivo_rechazo: gestion.motivo_rechazo_traslado || '',
        motivo_cancelacion: gestion.motivo_cancelacion_traslado || '',
      })
      setIsEditingTraslado(true)
    }
  }

  const handleAddNota = async (descripcion: string) => {
    if (!gestion || !user) return
    try {
      await createNota({
        gestion: gestion.id,
        descripcion,
        usuario: user.id,
        estado: 'pendiente',
      })
      await refetch()
    } catch (err) {
      console.error('Error adding nota:', err)
    }
  }

  const handleDeleteNota = async (notaId: string) => {
    try {
      await deleteNota(notaId)
      await refetch()
    } catch (err) {
      console.error('Error deleting nota:', err)
    }
  }

  const handleMarkNotaAsLista = async (notaId: string) => {
    try {
      await updateNota(notaId, { estado: 'Lista' })
      await refetch()
    } catch (err) {
      console.error('Error updating nota:', err)
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
                    <div className="flex gap-2 flex-wrap">
                      {getAllowedTransitions(gestion.estado_gestion).map((estado) => (
                        <Button
                          key={estado}
                          variant={gestion.estado_gestion === estado ? 'default' : 'outline'}
                          onClick={() => handleEstadoChange(estado)}
                          disabled={isSaving}
                          className={gestion.estado_gestion === estado ? 'bg-[#E3AE00] hover:bg-[#E3AE00]/90 transition-all duration-200' : 'hover:bg-[#671E75]/10 hover:border-[#671E75] transition-all duration-200'}
                        >
                          {getEstadoLabel(estado)}
                        </Button>
                      ))}
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
                      className="text-white hover:text-white transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: '#671E75' }}
                      disabled={getAllowedTransitions(gestion.estado_gestion).length === 0}
                    >
                      {getAllowedTransitions(gestion.estado_gestion).length === 0 
                        ? 'Estado Final - No editable' 
                        : 'Editar Estado'}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setIsEditing(false)}
                        className="text-white hover:text-white transition-all duration-200 hover:shadow-lg"
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


            {/* Detalles de Traslado */}
            {gestion.tipo_gestion === 'TRASLADO' && (
              <>
                <Card className="rounded-xl border-0 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Detalles de Traslado</CardTitle>
                    {!isEditingTraslado && (gestion.estado_traslado === 'ACEPTADO' || gestion.estado_traslado === 'PENDIENTE') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={openTrasladoEdit}
                        className="text-[#671E75] hover:bg-purple-50"
                      >
                        Actualizar estado
                      </Button>
                    )}
                   
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Estado de Traslado</p>
                        <p className="text-base font-semibold text-gray-900">
                          {gestion.estado_traslado_display || gestion.estado_traslado || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Tipo de Traslado</p>
                        <p className="text-base font-semibold text-gray-900">
                          {gestion.tipo_traslado_display || gestion.tipo_traslado || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Tipo de Solicitud</p>
                        <p className="text-base font-semibold text-gray-900">
                          {gestion.tipo_solicitud_traslado_display || gestion.tipo_solicitud_traslado || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Nivel de Atención</p>
                        <p className="text-base font-semibold text-gray-900">
                          {gestion.nivel_atencion_traslado_display || gestion.nivel_atencion_traslado || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Centro Destinatario</p>
                      <p className="text-base text-gray-900">
                        {gestion.centro_destinatario || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Motivo del Traslado</p>
                      <p className="text-base text-gray-900">
                        {gestion.motivo_traslado || 'N/A'}
                      </p>
                    </div>

                    {gestion.motivo_rechazo_traslado && (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-800 mb-1">Motivo de Rechazo</p>
                        <p className="text-sm text-red-700">
                          {gestion.motivo_rechazo_traslado}
                        </p>
                      </div>
                    )}

                    {gestion.motivo_cancelacion_traslado && (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-800 mb-1">Motivo de Cancelación</p>
                        <p className="text-sm text-yellow-700">
                          {gestion.motivo_cancelacion_traslado}
                        </p>
                      </div>
                    )}

                    {gestion.fecha_finalizacion_traslado && (
                      ['CANCELADO', 'COMPLETADO', 'RECHAZADO'].includes(gestion.estado_traslado || '') && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-blue-800 mb-1">Fecha de Finalización</p>
                          <p className="text-sm text-blue-700">
                            {new Date(gestion.fecha_finalizacion_traslado).toLocaleString('es-CL', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}
                          </p>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>

                {/* Edit Traslado Card - Appears Below */}
                {isEditingTraslado && (
                  <Card className="rounded-xl border-0 bg-purple-50 border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-purple-900">Editar Estado de Traslado</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Estado de Traslado
                        </label>
                        <select
                          value={trasladoForm.estado_traslado}
                          onChange={(e) => {
                            setTrasladoForm({
                              ...trasladoForm,
                              estado_traslado: e.target.value,
                              motivo_rechazo: '',
                              motivo_cancelacion: '',
                            })
                          }}
                          disabled={isSaving}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent text-sm"
                        >
                          <option value="">Selecciona un estado</option>
                          {estadosTransfer.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                              {estado.display}
                            </option>
                          ))}
                        </select>
                      </div>

                      {trasladoForm.estado_traslado === 'CANCELADO' && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Motivo de Cancelación <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={trasladoForm.motivo_cancelacion}
                            onChange={(e) => {
                              setTrasladoForm({
                                ...trasladoForm,
                                motivo_cancelacion: e.target.value,
                              })
                            }}
                            disabled={isSaving}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent text-sm"
                          >
                            <option value="">Selecciona un motivo</option>
                            {motivoCancelacionTraslado.map((motivo) => (
                              <option key={motivo} value={motivo}>
                                {motivo}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {trasladoForm.estado_traslado === 'RECHAZADO' && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Motivo de Rechazo <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={trasladoForm.motivo_rechazo}
                            onChange={(e) => {
                              setTrasladoForm({
                                ...trasladoForm,
                                motivo_rechazo: e.target.value,
                              })
                            }}
                            disabled={isSaving}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent text-sm"
                          >
                            <option value="">Selecciona un motivo</option>
                            {motivoRechazoTraslado.map((motivo) => (
                              <option key={motivo} value={motivo}>
                                {motivo}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleTrasladoChange}
                          disabled={isSaving || !trasladoForm.estado_traslado || 
                            (trasladoForm.estado_traslado === 'CANCELADO' && !trasladoForm.motivo_cancelacion) ||
                            (trasladoForm.estado_traslado === 'RECHAZADO' && !trasladoForm.motivo_rechazo)}
                          className="text-white hover:text-white"
                          style={{ backgroundColor: '#671E75' }}
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Guardando...
                            </>
                          ) : (
                            'Guardar'
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditingTraslado(false)
                            setTrasladoForm({ estado_traslado: '', motivo_rechazo: '', motivo_cancelacion: '' })
                          }}
                          variant="outline"
                          disabled={isSaving}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información Adicional */}
            <Card className="rounded-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Información Adicional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Fecha de Inicio</p>
                  <p className="text-sm text-gray-900">
                    {new Date(gestion.fecha_inicio).toLocaleString('es-CL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // Set to false for 24-hour format, or true for 12-hour
                      })};
                    {new Date(gestion.fecha_inicio).toLocaleString('es-CL')}
                  </p>
                </div> */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Fecha de Inicio</p>
                  <p className="text-sm text-gray-900">
                    {new Date(gestion.created_at).toLocaleString('es-CL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // Set to false for 24-hour format, or true for 12-hour
                      })};
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Última actualización</p>
                  <p className="text-sm text-gray-900">
                    {new Date(gestion.updated_at).toLocaleString('es-CL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // Set to false for 24-hour format, or true for 12-hour
                      })};
                    
                  </p>
                </div>
                {gestion.fecha_fin && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Fecha de Término</p>
                    <p className="text-sm text-gray-900">
                      {new Date(gestion.fecha_fin).toLocaleString('es-CL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // Set to false for 24-hour format, or true for 12-hour
                      })};
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Responsable</p>
                  {isEditingAsignado ? (
                    <div className="space-y-2">
                      <select
                        value={gestion.usuario || ''}
                        onChange={(e) => handleUsuarioChange(e.target.value)}
                        disabled={isSaving || loadingEnfermeros}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent text-sm"
                      >
                        <option value="">
                          {loadingEnfermeros ? 'Cargando...' : 'Selecciona un enfermero'}
                        </option>
                        {enfermeros.map((enfermero) => (
                          <option key={enfermero.id} value={enfermero.id}>
                            {enfermero.nombre} {enfermero.apellido}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingAsignado(false)}
                        disabled={isSaving}
                        className="w-full"
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : gestion.usuario ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900">{gestion.usuario_nombre}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingAsignado(true)}
                        className="text-[#671E75] hover:bg-purple-50"
                      >
                        Cambiar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 italic">Sin asignar</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingAsignado(true)}
                        className="text-[#671E75] hover:bg-purple-50"
                      >
                        Asignar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Botón ir a episodio */}
            <Button
              onClick={() => navigate(`/episodios/${gestion.episodio}`)}
              className="w-full flex items-center gap-2 text-white hover:text-white"
              style={{ backgroundColor: '#671E75' }}
            >
              <ArrowLeft className="h-4 w-4 rotate-180" />
              Ir al Episodio
            </Button>

            
            {/* Notas */}
            {gestion.notas && (
              <NotasCard
                notas={gestion.notas}
                onCreateNota={handleAddNota}
                onDeleteNota={handleDeleteNota}
                onMarkAsLista={handleMarkNotaAsLista}
                loading={loadingNotas}
              />
            )}
          </div>
        </div>

        {/* Confirmation Dialog for Estado Change */}
        {showEstadoConfirmation && pendingEstadoChange && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Card className="rounded-xl border-0 max-w-md w-full mx-4 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-yellow-100">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg">Confirmar Cambio de Estado</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">¿Está seguro de que desea cambiar el estado de la gestión a:</p>
                <p className="text-lg font-semibold text-[#671E75] mb-6">{getEstadoLabel(pendingEstadoChange)}</p>
                {pendingEstadoChange === 'COMPLETADA' && (
                  <p className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    ℹ️ Al completar la gestión, se registrará automáticamente la fecha actual como fecha de finalización.
                  </p>
                )}
                
                {updateError && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 whitespace-pre-wrap">{updateError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={confirmEstadoChange}
                    disabled={isSaving}
                    className="flex-1 text-white hover:text-white"
                    style={{ backgroundColor: '#671E75' }}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Confirmando...
                      </>
                    ) : (
                      'Confirmar'
                    )}
                  </Button>
                  <Button
                    onClick={cancelEstadoChange}
                    disabled={isSaving}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
