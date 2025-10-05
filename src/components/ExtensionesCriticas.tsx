import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { extensionesCriticas } from '@/data/mockData'

function getDiasEstadiaColor(dias: string) {
  const numeroDias = parseInt(dias.split(' ')[0])
  if (numeroDias >= 30) {
    return 'bg-red-100 text-red-800 border-red-200 rounded-full whitespace-nowrap'
  } else if (numeroDias >= 20) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200 rounded-full whitespace-nowrap'
  } else {
    return 'bg-green-100 text-green-800 border-green-200 rounded-full whitespace-nowrap'
  }
}

export function ExtensionesCriticas() {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Extensiones críticas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Episodio</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Paso estadía</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extensionesCriticas.map((extension, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{extension.episodio}</TableCell>
                <TableCell>{extension.paciente}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getDiasEstadiaColor(extension.pasoEstadia)}
                  >
                    {extension.pasoEstadia}
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
