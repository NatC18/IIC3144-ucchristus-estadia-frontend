import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { type Episodio } from '@/data/mockData'

interface EpisodiosPacientesProps {
  episodios: Episodio[]
  onSelectEpisodio: (episodio: Episodio) => void
  selectedEpisodio?: Episodio | null
}

export function EpisodiosPacientes({
  episodios,
  onSelectEpisodio,
  selectedEpisodio
}: EpisodiosPacientesProps) {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Episodios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Episodio</TableHead>
              <TableHead>Norma</TableHead>
              <TableHead>Estadía</TableHead>
              <TableHead>Fecha ingreso</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {episodios.map((episodio) => {
              const isSelected = selectedEpisodio?.id === episodio.id
              return (
                <TableRow
                  key={episodio.id}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-purple-100 hover:bg-purple-100' // keep selected highlight
                      : 'hover:bg-purple-50'
                  }`}
                  onClick={() => onSelectEpisodio(episodio)}
                >
                  <TableCell className="font-medium">{episodio.episodio}</TableCell>
                  <TableCell>{episodio.norma}</TableCell>
                  <TableCell>{episodio.tiempoEstadia}</TableCell>
                  <TableCell>{episodio.fechaIngreso}</TableCell>
                  <TableCell
                    className={`font-semibold ${
                      episodio.estado === 'Activo' ? 'text-[#671E75]' : 'text-gray-500'
                    }`}
                  >
                    {episodio.estado}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}