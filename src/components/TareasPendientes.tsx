import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
  
  

export function TareasPendientes() {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tareas pendientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Episodio</TableHead>
              <TableHead>Tipo de barrera</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tareasPendientes.map((tarea, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{tarea.episodio}</TableCell>
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
  )
}
