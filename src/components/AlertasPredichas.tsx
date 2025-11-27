import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface AlertaPrediccion {
  id: number
  episodio: string
  paciente: string
  dias_estadia: number
  dias_esperados: number
  fecha_ingreso: string
}

interface AlertasPredichasProps {
  alertas: AlertaPrediccion[]
  loading?: boolean
}

export function AlertasPredichas({ alertas, loading }: AlertasPredichasProps) {
  const navigate = useNavigate()
  
  // Limitar a las primeras 5 alertas de predicción
  const alertasLimitadas = alertas.slice(0, 5)
  
  if (loading) {
    return (
      <Card className="rounded-xl border-0 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Alertas predichas de larga estadía
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">Cargando...</p>
        </CardContent>
      </Card>
    )
  }

  if (alertas.length === 0) {
    return (
      <Card className="rounded-xl border-0 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Alertas predichas de larga estadía
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">No hay alertas de predicción activas</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Alertas predichas de larga estadía
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Episodio</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Días Actuales</TableHead>
              <TableHead>Días Esperados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertasLimitadas.map((alerta, index) => (
              <TableRow 
                key={index}
                onClick={() => navigate(`/episodios/${alerta.id}`)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium">{alerta.episodio}</TableCell>
                <TableCell>{alerta.paciente}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className="bg-yellow-100 text-yellow-800 border-yellow-300"
                  >
                    {alerta.dias_estadia} días
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {alerta.dias_esperados} días
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
