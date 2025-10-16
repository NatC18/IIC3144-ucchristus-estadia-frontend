import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User } from 'lucide-react'
import type { Paciente } from '@/data/mockData' 

// Only use the fields we actually need from Paciente
type InformacionPacienteProps = Pick<
  Paciente,
  'nombre' | 'rut' | 'edad' | 'sexo' | 'prevision' | 'score' | 'hospitalizado'
>

function getHospitalizacionColor(hospitalizado: Paciente['hospitalizado']) {
  switch (hospitalizado) {
    case true:
      return 'bg-blue-100 text-blue-800 rounded-full whitespace-nowrap'
    case false:
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
    default:
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
  }
}

export function InformacionPaciente({
  nombre,
  rut,
  edad,
  sexo,
  prevision,
  score,
  hospitalizado,
}: InformacionPacienteProps) {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader className="border-b border-gray-100 pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-[#671E75]">
          <User className="h-5 w-5" />
          Información de paciente {nombre}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-4">
        <div>
          <p className="text-sm text-gray-500">RUT</p>
          <p className="font-semibold text-gray-900">{rut}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Edad</p>
          <p className="font-semibold text-gray-900">{edad} años</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Sexo</p>
          <p className="font-semibold text-gray-900">
            {sexo === 'M' ? 'Masculino' : 'Femenino'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Previsión</p>
          <p className="font-semibold text-gray-900">{prevision}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Score</p>
          <p className="font-semibold text-gray-900">{score}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Estado</p>
          <div className="mt-1">
            <Badge
              variant="outline"
              className={getHospitalizacionColor(hospitalizado)}
            >
              {hospitalizado ? "Hospitalizado" : "Egresado"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
