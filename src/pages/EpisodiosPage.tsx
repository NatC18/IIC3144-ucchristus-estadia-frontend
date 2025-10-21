import { useState } from 'react'
import { Header } from '@/components/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEpisodios } from '@/hooks/useEpisodios'
import { usePacientes } from '@/hooks/usePacientes'

function getEstadoColor(estado: string) {
  switch (estado) {
    case 'Activo':
      return 'bg-[#FBF2CC] text-[#E3AE00] rounded-full whitespace-nowrap'
    case 'Egresado':
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
    default:
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
  }
}

export function EpisodiosPage() {
  const navigate = useNavigate()
  const { episodios, loading: isLoading, error } = useEpisodios()
  const { pacientes} = usePacientes()

  const episodiosConNombre = episodios.map(ep => {
    const paciente = pacientes.find(p => p.id === ep.paciente)
    return {
      ...ep,
      paciente_nombre: paciente ? paciente.nombre : '—'
    }
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('all')

  // Filtrar episodios según búsqueda y estado
  const filteredEpisodios = episodiosConNombre?.filter(ep => {
    const matchesSearch =
      ep.episodio_cmbd?.toString().includes(searchTerm) ||
      ep.paciente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ep.especialidad?.toLowerCase().includes(searchTerm.toLowerCase())

    const activo = !ep.fecha_egreso
    const estado = activo ? 'Activo' : 'Egresado'
    const matchesFilter = filterEstado === 'all' || estado === filterEstado

    return matchesSearch && matchesFilter
  }) || []

  // Estadísticas
  const total = episodios?.length || 0
  const activos = episodios?.filter(e => !e.fecha_egreso).length || 0
  const egresados = episodios?.filter(e => e.fecha_egreso).length || 0

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Episodios</h1>
            <p className="text-gray-600">Monitoreo y gestión de episodios clínicos</p>
          </div>
          <Button 
            onClick={() => navigate('/episodios/create')}
            className="flex items-center gap-2 text-white hover:text-white"
            style={{ backgroundColor: '#671E75' }}
          >
            <Plus className="h-4 w-4" />
            Nuevo Episodio
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border-0">
            <p className="text-sm font-medium text-gray-600">Total Episodios</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-0">
            <p className="text-sm font-medium text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-gray-900">{activos}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-0">
            <p className="text-sm font-medium text-gray-600">Egresados</p>
            <p className="text-2xl font-bold text-gray-900">{egresados}</p>
          </div>
        </div>

        {/* Tabla principal */}
        <div className="bg-white rounded-xl border-0">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Listado de Episodios</h2>
              <div className="flex items-center gap-4">
                {/* Buscador */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Buscar por paciente, especialidad..." 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Filtro */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#671E75]"
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="Activo">Activos</option>
                    <option value="Egresado">Egresados</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <p className="text-center text-gray-500">Cargando episodios...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error al cargar episodios</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CMBD</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEpisodios.length > 0 ? (
                    filteredEpisodios.map((ep) => {
                      const estado = ep.fecha_egreso ? 'Egresado' : 'Activo'
                      return (
                        <TableRow key={ep.id}>
                          <TableCell className="font-medium">{ep.episodio_cmbd}</TableCell>
                          <TableCell>{ep.paciente_nombre || '—'}</TableCell>
                          <TableCell>{ep.especialidad || '—'}</TableCell>
                          <TableCell>{ep.tipo_actividad || '—'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getEstadoColor(estado)}>
                              {estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-[#671E75] hover:bg-purple-50"
                              onClick={() => navigate(`/episodios/${ep.id}`)}
                            >
                              Ver detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No se encontraron episodios
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
