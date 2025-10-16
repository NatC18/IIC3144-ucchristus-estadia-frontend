import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft } from 'lucide-react'
import { pacientes, episodios, tareasPendientes, type Episodio, type TareaPendiente } from '@/data/mockData'
import { InformacionPaciente } from '@/components/InformacionPaciente'
import { EpisodiosPacientes } from '@/components/EpisodiosPaciente'

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
  

export function PacienteDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const paciente = pacientes.find(p => p.id === parseInt(id || '0'))

  if (!paciente) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="mb-8 flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Paciente no encontrado</h1>
          </div>
          <p className="text-gray-600">No se encontró el paciente con ID {id}.</p>
        </main>
      </div>
    )
  }
  const [selectedEpisodio, setSelectedEpisodio] = useState<Episodio | null>(null)

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Detalle paciente</h1>
          <p className="text-gray-600">Información detallada de pacientes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <InformacionPaciente
              nombre={paciente.nombre}
              rut={paciente.rut}
              edad={paciente.edad}
              sexo={paciente.sexo}
              prevision={paciente.prevision}
              score={paciente.score}
              hospitalizado={paciente.hospitalizado}
            />
            <EpisodiosPacientes
              episodios={episodios}
              onSelectEpisodio={setSelectedEpisodio}
              selectedEpisodio={selectedEpisodio}
            />
          </div>

          <div className="space-y-8">
            {selectedEpisodio ? (
              <Card className="rounded-xl border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    Tareas asociadas a episodio {selectedEpisodio.episodio}
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
                    <TableBody>
                      {/* Filter the tareasPendientes by selectedEpisodio */}
                      {tareasPendientes.filter(tarea => tarea.episodio === selectedEpisodio.episodio).map((tarea, index) => (
                        <TableRow key={index}>
                          <TableCell>{tarea.tipoBarrera}</TableCell>
                          <TableCell>{tarea.descripcion}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={getEstadoColor(tarea.estado)}
                            >
                              {tarea.estado}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-xl border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
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
