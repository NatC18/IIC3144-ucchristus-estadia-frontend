import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ExtensionCritica {
  episodio: string
  paciente: string
  dias_estadia: number
  fecha_ingreso: string
}

interface ExtensionesCriticasProps {
  extensiones: ExtensionCritica[]
  loading?: boolean
}

function getDiasEstadiaColor(_dias: number) {
  // Siempre color de alerta clínica (rosita)
  void _dias; // usado para cumplir linter (param intencionalmente ignorado)
  return 'bg-[#F3D7E0] text-[#B95E82] rounded-full whitespace-nowrap';
}

export function ExtensionesCriticas({ extensiones, loading }: ExtensionesCriticasProps) {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Extensiones críticas</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Cargando extensiones...</p>
        ) : extensiones.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay extensiones críticas</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Episodio</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Días de estadía</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extensiones.map((extension, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{extension.episodio}</TableCell>
                  <TableCell>{extension.paciente}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getDiasEstadiaColor(extension.dias_estadia)}
                    >
                      {extension.dias_estadia} días
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
