import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { pacientes } from '@/data/mockData'
import { InformacionPaciente } from '@/components/InformacionPaciente'

export function PacienteDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const pacienteIndex = parseInt(id || '0')

  const paciente = pacientes[pacienteIndex]

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
          </div>

          <div className="space-y-8">
          </div>
        </div>
      </main>
    </div>
  )
}
