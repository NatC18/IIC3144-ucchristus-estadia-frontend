import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Loader2, AlertCircle, RefreshCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePacientes } from '@/hooks/usePacientes'
import { mapPacienteFromAPI } from '@/utils/pacienteMapper'
import { getHospitalizacionColor } from '@/lib/transformations'



export function PacientesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterHospitalizado, setFilterHospitalizado] = useState<string>('all')
  
  // Usar el hook para obtener datos del backend
  const { 
    pacientes: pacientesAPI, 
    loading, 
    error, 
    totalCount,
    fetchPacientes,
    refetch 
  } = usePacientes()

  // Convertir datos del backend al formato del frontend
  const pacientes = pacientesAPI.map(mapPacienteFromAPI)

  // Filter patients based on search and filter
  const filteredPacientes = pacientes.filter(paciente => {
    const matchesSearch = 
      paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.prevision.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterHospitalizado === 'all' || paciente.hospitalizado === (filterHospitalizado === 'hospitalizado')

    return matchesSearch && matchesFilter
  })

  // Función para refrescar datos
  const handleRefresh = () => {
    refetch()
  }

  // Función para buscar con filtros
  const handleSearch = useCallback(() => {
    fetchPacientes({
      search: searchTerm || undefined,
    })
  }, [fetchPacientes, searchTerm])

  // Buscar automáticamente cuando cambie el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        handleSearch()
      } else {
        refetch()
      }
    }, 500) // Debounce de 500ms

    return () => clearTimeout(timer)
  }, [searchTerm, handleSearch, refetch])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pacientes</h1>
            <p className="text-gray-600">
              Historial de pacientes hospitalizados en UC Christus 
              {totalCount > 0 && ` (${totalCount} pacientes)`}
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Error al cargar pacientes: {error}</span>
                <Button 
                  onClick={handleRefresh} 
                  variant="outline" 
                  size="sm"
                  className="ml-auto"
                >
                  Reintentar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content - Tasks Table */}
        <div className="bg-white rounded-xl border-0">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Todos los pacientes en UC Christus</h2>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Buscar por nombre, rut o previsión" 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#671E75]"
                    value={filterHospitalizado}
                    onChange={(e) => setFilterHospitalizado(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="hospitalizado">Hospitalizado</option>
                    <option value="egresado">Egresado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rut</TableHead>
                  <TableHead>Previsión</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Hospitalizado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando pacientes...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPacientes.length > 0 ? (
                  filteredPacientes.map((paciente, index) => (
                    <TableRow key={paciente.id || index}>
                      <TableCell className="font-medium">{paciente.nombre}</TableCell>
                      <TableCell>{paciente.rut}</TableCell>
                      <TableCell>{paciente.prevision}</TableCell>
                      <TableCell>{paciente.score}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getHospitalizacionColor(paciente.hospitalizado)}
                        >
                          {paciente.hospitalizado ? "Hospitalizado" : "Egresado"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" size="sm" className="text-[#671E75] hover:bg-purple-50"
                          onClick={() => navigate(`/pacientes/${paciente.id}`)}
                        >
                          Ver detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm ? 
                        'No se encontraron pacientes que coincidan con tu búsqueda' :
                        'No hay pacientes disponibles'
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}
