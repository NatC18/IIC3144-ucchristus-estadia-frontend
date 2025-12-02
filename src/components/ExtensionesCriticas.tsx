import type { MouseEvent } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'

export interface ExtensionCritica {
  id: string | number
  episodio: string
  paciente: string
  dias_estadia: number
  fecha_ingreso: string
  ignorar?: boolean | number | string | null
}

interface ExtensionesCriticasProps {
  extensiones: ExtensionCritica[]
  loading?: boolean
  onToggleIgnorar?: (extension: ExtensionCritica) => Promise<void> | void
}

function getDiasEstadiaColor(_dias: number) {
  // Siempre color de alerta clínica (rosita)
  void _dias; // usado para cumplir linter (param intencionalmente ignorado)
  return 'bg-[#F3D7E0] text-[#B95E82] rounded-full whitespace-nowrap';
}

export function ExtensionesCriticas({ extensiones, loading, onToggleIgnorar }: ExtensionesCriticasProps) {
  const navigate = useNavigate()
  const estaIgnorada = (valor: ExtensionCritica['ignorar']) =>
    valor === true || valor === 1 || valor === '1'

  const extensionesActivas = extensiones.filter((ext) => !estaIgnorada(ext.ignorar)).slice(0, 5)
  const extensionesIgnoradas = extensiones.filter((ext) => estaIgnorada(ext.ignorar)).slice(0, 5)

  const handleActionClick = (event: MouseEvent, extension: ExtensionCritica) => {
    event.stopPropagation()
    onToggleIgnorar?.(extension)
  }

  const renderTable = (items: ExtensionCritica[], mostrarAccionIncorporar: boolean) => {
    if (items.length === 0) {
      return (
        <p className="text-gray-500 text-center py-4">
          {mostrarAccionIncorporar ? 'No hay extensiones críticas ignoradas' : 'No hay extensiones críticas'}
        </p>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Episodio</TableHead>
            <TableHead>Paciente</TableHead>
            <TableHead>Días de estadía</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((extension) => (
            <TableRow 
              key={extension.id}
              onClick={() => navigate(`/episodios/${extension.id}`)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
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
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(event) => handleActionClick(event, extension)}
                  className={
                    mostrarAccionIncorporar
                      ? 'border-blue-200 text-blue-600 hover:bg-blue-50'
                      : 'border-red-200 text-red-600 hover:bg-red-50'
                  }
                >
                  {mostrarAccionIncorporar ? 'Incorporar' : 'Ignorar'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Extensiones críticas actuales</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Cargando extensiones...</p>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-700">Extensiones críticas actuales</h3>
              </div>
              {renderTable(extensionesActivas, false)}
            </div>

            <div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-700">Extensiones críticas actuales ignoradas</h3>
              </div>
              {renderTable(extensionesIgnoradas, true)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
