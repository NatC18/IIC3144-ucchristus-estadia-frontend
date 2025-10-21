import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { useEpisodio } from '@/hooks/useEpisodio'
import { usePaciente } from '@/hooks/usePaciente'
import { useGestiones } from '@/hooks/useGestiones'


function getTipoColor(tipo: string) {
  if (!tipo) return 'bg-gray-100 text-gray-700 rounded-full px-3 py-1'
  switch (tipo.toLowerCase()) {
    case 'quirúrgico':
      return 'bg-[#E3AE00]/20 text-[#E3AE00] font-medium rounded-full px-3 py-1'
    case 'médico':
      return 'bg-[#8FA31E]/20 text-[#8FA31E] font-medium rounded-full px-3 py-1'
    default:
      return 'bg-gray-100 text-gray-700 rounded-full px-3 py-1'
  }
}

function getEstadoColor(estado: string) {
  switch (estado.toLowerCase()) {
    case 'activo':
      return 'bg-[#FBF2CC] text-[#E3AE00] rounded-full px-3 py-1 font-medium'
    case 'egresado':
      return 'bg-gray-100 text-gray-700 rounded-full px-3 py-1 font-medium'
    default:
      return 'bg-gray-100 text-gray-700 rounded-full px-3 py-1 font-medium'
  }
}


export function EpisodioDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { episodio, loading, error } = useEpisodio(id)
  const { gestiones, loading: loadingGestiones } = useGestiones(episodio?.id)
  const { paciente } = usePaciente(episodio?.paciente)


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Cargando episodio...
      </div>
    )
  }

  if (error || !episodio) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Error al cargar el episodio
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Botón Volver + Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/episodios')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Episodios
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Detalle del Episodio
            </h1>
            <p className="text-gray-600">CMBD #{episodio.episodio_cmbd}</p>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información General */}
            <Card className="rounded-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Información del Episodio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Paciente</p>
                    <p className="text-base font-semibold text-gray-900">
                      {paciente?.nombre || 'Sin nombre'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Especialidad</p>
                    <p className="text-base text-gray-900">{episodio.especialidad || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Fecha de Ingreso</p>
                    <p className="text-base text-gray-900">
                      {new Date(episodio.fecha_ingreso).toLocaleString('es-CL')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Fecha de Egreso</p>
                    <p className="text-base text-gray-900">
                      {episodio.fecha_egreso
                        ? new Date(episodio.fecha_egreso).toLocaleString('es-CL')
                        : 'Aún hospitalizado'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Tipo de Actividad</p>
                  <Badge variant="outline" className={getTipoColor(episodio.tipo_actividad)}>
                    {episodio.tipo_actividad || 'Sin especificar'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Estado del Episodio</p>
                  <Badge
                    variant="outline"
                    className={getEstadoColor(episodio.fecha_egreso ? 'Egresado' : 'Activo')}
                  >
                    {episodio.fecha_egreso ? 'Egresado' : 'Activo'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Estancia Norma GRD</p>
                    <p className="text-base text-gray-900">
                      {episodio.estancia_norma_grd ? `${episodio.estancia_norma_grd} días` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Estancia Prequirúrgica</p>
                    <p className="text-base text-gray-900">
                      {episodio.estancia_prequirurgica ? `${episodio.estancia_prequirurgica} días` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Estancia Postquirúrgica</p>
                    <p className="text-base text-gray-900">
                      {episodio.estancia_postquirurgica ? `${episodio.estancia_postquirurgica} días` : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del Paciente */}
            <Card className="rounded-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Datos del Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">RUT</p>
                    <p className="text-base text-gray-900">{paciente?.rut || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Previsión</p>
                    <p className="text-base text-gray-900">{paciente?.prevision_1 || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Previsión Adicional</p>
                    <p className="text-base text-gray-900">{paciente?.prevision_2 || 'N/A'}</p>
                  </div>                  
                </div>
              </CardContent>
            </Card>
            {/* Gestiones asociadas al episodio */}
            <Card className="rounded-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Gestiones Asociadas</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingGestiones ? (
                  <p className="text-gray-500">Cargando gestiones...</p>
                ) : gestiones.length === 0 ? (
                  <p className="text-gray-500">No hay gestiones registradas para este episodio.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {gestiones.map((g) => (
                      <li key={g.id} className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{g.tipo_gestion}</p>
                            <p className="text-sm text-gray-600">{g.informe || 'Sin descripción'}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Inicio: {new Date(g.fecha_inicio).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={
                                g.estado_gestion === 'COMPLETADA'
                                  ? 'bg-green-100 text-green-800'
                                  : g.estado_gestion === 'EN_PROGRESO'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {g.estado_gestion}
                            </Badge>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>


          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Información Adicional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Cama Asignada</p>
                  <p className="text-sm text-gray-900">{episodio.cama?.codigo_cama || 'No asignada'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Estado</p>
                  <p className="text-sm text-gray-900">
                    {episodio.fecha_egreso ? 'Egresado' : 'Activo'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Última Actualización</p>
                  <p className="text-sm text-gray-900">
                    {new Date(episodio.updated_at).toLocaleString('es-CL')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p>
                      Este episodio está conectado con el historial clínico del paciente y
                      puede incluir datos quirúrgicos, médicos o administrativos.
                    </p>
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
