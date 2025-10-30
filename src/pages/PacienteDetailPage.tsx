import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft } from 'lucide-react'
import { usePaciente } from '@/hooks/usePacientes'
import { useEpisodiosPaciente } from '@/hooks/useEpisodiosPaciente'
import { useGestiones } from '@/hooks/useGestiones'
import { InformacionPaciente } from '@/components/InformacionPaciente'
import { EpisodiosPacientes } from '@/components/EpisodiosPaciente'
import { mapPacienteFromAPI } from '@/utils/pacienteMapper'
import { mapEpisodioFromAPI, type Episodio } from '@/utils/episodioMapper'
import { getEstadoGestionColor } from '@/lib/transformations'

export function PacienteDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { paciente: pacienteAPI, loading, error, fetchPaciente } = usePaciente()
  const { episodiosPaciente, loading: loadingEpisodios, error: errorEpisodios, fetchEpisodiosPaciente } = useEpisodiosPaciente()
  const [selectedEpisodio, setSelectedEpisodio] = useState<Episodio | null>(null)

  const paciente = pacienteAPI ? mapPacienteFromAPI(pacienteAPI) : null

  useEffect(() => {
    if (id) fetchPaciente(id)
  }, [id, fetchPaciente])

  useEffect(() => {
    if (id) fetchEpisodiosPaciente(id)
  }, [id, fetchEpisodiosPaciente])

  const episodios = episodiosPaciente.map(mapEpisodioFromAPI)

  const { gestiones, loading: loadingGestiones } = useGestiones(selectedEpisodio?.id)

  useEffect(() => {
    console.log(gestiones, "gestiones cargadas en PacienteDetailPage")
  }, [gestiones])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header />
        <p className="text-gray-600 text-lg mt-6">Cargando paciente...</p>
      </div>
    )
  }

  // Error when loading the patient
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Header />
        <p className="text-red-600 text-lg mt-6">
          Ocurrió un error al cargar el paciente: {error}
        </p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Volver atrás
        </Button>
      </div>
    )
  }

  // Patient not found
  if (!paciente) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Paciente no encontrado
            </h1>
          </div>
          <p className="text-gray-600">
            No se encontró el paciente con ID {id}.
          </p>
        </main>
      </div>
    )
  }

  // Patient detail view
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/pacientes')} className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Pacientes
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Detalle de Paciente
          </h1>
          <p className="text-gray-600">
            Detalles del paciente {paciente.nombre}
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-8">
            <InformacionPaciente {...paciente} />
            <EpisodiosPacientes
              episodios={episodios}
              selectedEpisodio={selectedEpisodio}
              onSelectEpisodio={(episodio: Episodio) => setSelectedEpisodio(episodio)}
              loading={loadingEpisodios}
              error={errorEpisodios}
            />
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {selectedEpisodio ? (
              <Card className="rounded-xl border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    Tareas asociadas al episodio {selectedEpisodio.episodio_cmbd}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo de barrera</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    {/* Placeholder when loading gestiones */}
                    <TableBody>
                      {loadingGestiones ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            Cargando gestiones...
                          </TableCell>
                        </TableRow>
                      ) : (
                        gestiones.map((g, i) => (
                          <TableRow key={i}>
                            <TableCell>{g.tipo_gestion}</TableCell>
                            <TableCell>{g.informe}</TableCell>
                            <TableCell>
                              <Badge className={getEstadoGestionColor(g.estado_gestion)}>
                                {g.estado_gestion === 'COMPLETADA' ? 'Cerrada' : g.estado_gestion === 'EN_PROGRESO' ? 'En progreso' : 'Abierta'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-xl border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Selecciona un episodio para ver sus tareas asociadas
                  </CardTitle>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}