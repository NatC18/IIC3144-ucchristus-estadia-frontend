import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface TareaPendiente {
  id: string
  episodio: string
  tipo_gestion: string
  descripcion: string
  estado: 'Abierta' | 'En proceso' | 'Cerrada'
  fecha_inicio: string
}

interface TareasPendientesProps {
  tareas: TareaPendiente[]
  loading?: boolean
}

export function getEstadoColor(estado: TareaPendiente['estado']) {
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

export function TareasPendientes({ tareas, loading }: TareasPendientesProps) {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tareas pendientes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Cargando tareas...</p>
        ) : tareas.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay tareas pendientes</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Episodio</TableHead>
                <TableHead>Tipo de gestión</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tareas.map((tarea) => (
                <TableRow key={tarea.id}>
                  <TableCell className="font-medium">{tarea.episodio}</TableCell>
                  <TableCell>{tarea.tipo_gestion}</TableCell>
                  <TableCell>{tarea.descripcion}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(tarea.fecha_inicio).toLocaleDateString('es-CL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </TableCell>
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
        )}
      </CardContent>
    </Card>
  )
}
