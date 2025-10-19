import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { type Episodio } from '@/utils/episodioMapper'

interface EpisodiosPacientesProps {
  episodios: Episodio[]
  onSelectEpisodio: (episodio: Episodio) => void
  selectedEpisodio?: Episodio | null,
  loading: boolean
  error: string | null
}

export function EpisodiosPacientes({
  episodios,
  onSelectEpisodio,
  selectedEpisodio,
  loading,
  error
}: EpisodiosPacientesProps) {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Episodios
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Cargando episodios...</p>
        ) : error ? (
          <p className="text-red-600 text-center py-4">{error}</p>
        ) : episodios.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay episodios disponibles</p>
        ) : (
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
                        ? 'bg-purple-100 hover:bg-purple-100'
                        : 'hover:bg-purple-50'
                    }`}
                    onClick={() => onSelectEpisodio(episodio)}
                  >
                    <TableCell className="font-medium">{episodio.episodio_cmbd}</TableCell>
                    <TableCell>{episodio.estancia_norma_grd}</TableCell>
                    <TableCell>
                      {episodio.fecha_egreso
                        ? Math.floor((episodio.fecha_egreso.getTime() - episodio.fecha_ingreso.getTime()) / (1000 * 60 * 60 * 24))
                        : Math.floor((Date.now() - episodio.fecha_ingreso.getTime()) / (1000 * 60 * 60 * 24))} días
                    </TableCell>
                    <TableCell>{episodio.fecha_ingreso.toLocaleDateString()}</TableCell>
                    <TableCell
                      className={`font-semibold ${
                        episodio.fecha_egreso === null ? 'text-[#671E75]' : 'text-gray-500'
                      }`}
                    >
                      {episodio.fecha_egreso === null ? 'Activo' : 'Egresado'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
