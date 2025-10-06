import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle } from 'lucide-react'
import { alertasPredichas } from '@/data/mockData'

function getTipoBarreraColor(tipo: string) {
    switch (tipo) {
      case 'Social':
        return 'bg-blue-100 text-blue-800rounded-full whitespace-nowrap'
      case 'Administrativa':
        return 'bg-purple-100 rounded-full whitespace-nowrap'
      case 'Clínica':
        return 'bg-[#F3D7E0] text-[#B95E82] rounded-full whitespace-nowrap'
      case 'Técnica':
        return 'bg-gray-100 text-gray-800 border-gray-200 rounded-full whitespace-nowrap'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 rounded-full whitespace-nowrap'
    }
  }
  

export function AlertasPredichas() {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Alertas predichas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Episodio</TableHead>
              <TableHead>Tipo de barrera</TableHead>
              <TableHead>Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertasPredichas.map((alerta, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{alerta.episodio}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getTipoBarreraColor(alerta.tipoBarrera)}
                    style={alerta.tipoBarrera === 'Administrativa' ? { color: '#671E75', backgroundColor: '#f3e8ff', borderColor: '#d8b4fe' } : {}}
                  >
                    {alerta.tipoBarrera}
                  </Badge>
                </TableCell>
                <TableCell>{alerta.descripcion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
