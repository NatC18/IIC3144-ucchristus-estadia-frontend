import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Loader2, AlertCircle, RefreshCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGestiones, type Gestion } from '@/hooks/useGestiones'
import { useEnfermeros } from '@/hooks/useEnfermeros'

function getEstadoColor(estado: Gestion['estado_gestion']) {
  switch (estado) {
    case 'INICIADA':
      return 'bg-[#FBF2CC] text-[#E3AE00] rounded-full whitespace-nowrap'
    case 'EN_PROGRESO':
      return 'bg-[#ECEFCF] text-[#8FA31E] rounded-full whitespace-nowrap'
    case 'COMPLETADA':
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
    case 'CANCELADA':
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
    default:
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
  }
}

export function GestionesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('all')
  const [filterResponsable, setFilterResponsable] = useState<string>('all')

  // Usar el hook para obtener datos del backend
  const {
    gestiones,
    loading,
    error,
    totalCount,
    fetchGestiones,
  } = useGestiones()

  // Fetch enfermeros for the filter dropdown
  const { enfermeros } = useEnfermeros()

  // Filter gestiones based on search and filter
  const filteredGestiones = gestiones.filter(gestion => {
    const matchesSearch = 
      String(gestion.episodio_cmbd).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(gestion.tipo_gestion).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstadoFilter = filterEstado === 'all' || gestion.estado_gestion === filterEstado
    
    const matchesResponsableFilter = filterResponsable === 'all' 
      ? true 
      : filterResponsable === 'sin-asignar' 
      ? !gestion.usuario 
      : gestion.usuario === filterResponsable

    return matchesSearch && matchesEstadoFilter && matchesResponsableFilter
  })

  // Statistics
  const totalGestiones = gestiones.length
  const iniciadas = gestiones.filter(g => g.estado_gestion === 'INICIADA').length
  const enProgreso = gestiones.filter(g => g.estado_gestion === 'EN_PROGRESO').length
  const canceladas = gestiones.filter(g => g.estado_gestion === 'CANCELADA').length
  const completadas = gestiones.filter(g => g.estado_gestion === 'COMPLETADA').length


  // Función para refrescar datos
  const handleRefresh = () => {
    fetchGestiones()
  }

  // Función para buscar con filtros
  const handleSearch = useCallback(() => {
    fetchGestiones({
      search: undefined,
      estado: filterEstado === 'all' ? undefined : filterEstado,
    })
  }, [fetchGestiones, filterEstado])

  // Buscar automáticamente cuando cambien los filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch()
    }, 500) // Debounce de 500ms

    return () => clearTimeout(timer)
  }, [filterEstado, handleSearch])

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestiones</h1>
            <p className="text-gray-600">
              Gestión de tareas y barreras hospitalarias
              {totalCount > 0 && ` (${totalCount} gestiones)`}
            </p>
          </div>
          <div className="flex items-center gap-4">
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
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>Error al cargar gestiones: {error}</span>
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm"
                className="ml-auto"
              >
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#f3e8ff' }}>
                <svg className="w-6 h-6" style={{ color: '#671E75' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Gestiones</p>
                <p className="text-2xl font-bold text-gray-900">{totalGestiones}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#FBF2CC' }}>
                <svg className="w-6 h-6" style={{ color: '#E3AE00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Iniciadas</p>
                <p className="text-2xl font-bold text-gray-900">{iniciadas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#ECEFCF' }}>
                <svg className="w-6 h-6" style={{ color: '#8FA31E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{enProgreso}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#d1efcfff' }}>
                <svg className="w-6 h-6" style={{ color: '#8FA31E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{completadas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-gray-100">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-gray-900">{canceladas}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Tasks Table */}
        <div className="bg-white rounded-xl border-0">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Todas las Gestiones</h2>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Buscar por episodio, tipo de gestión..." 
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
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="INICIADA">Iniciada</option>
                  <option value="EN_PROGRESO">En progreso</option>
                  <option value="COMPLETADA">Completada</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#671E75]"
                  value={filterResponsable}
                  onChange={(e) => setFilterResponsable(e.target.value)}
                >
                  <option value="all">Todos los responsables</option>
                  <option value="sin-asignar">Sin asignar</option>
                  {enfermeros.map((enfermero) => (
                    <option key={enfermero.id} value={enfermero.id}>
                      {enfermero.nombre} {enfermero.apellido}
                    </option>
                  ))}
                </select>
              </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Episodio</TableHead>
                  <TableHead>Tipo de Gestión</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando gestiones...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredGestiones.length > 0 ? (
                  filteredGestiones.map((gestion) => (
                    <TableRow key={gestion.id}>
                      <TableCell className="font-medium">{gestion.episodio_cmbd}</TableCell>
                      <TableCell>{gestion.tipo_gestion}</TableCell>
                      <TableCell>{gestion.usuario_nombre || 'Sin asignar'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getEstadoColor(gestion.estado_gestion)}
                        >
                          {gestion.estado_gestion}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[#671E75] hover:bg-purple-50"
                          onClick={() => navigate(`/gestiones/${gestion.id}`)}
                        >
                          Ver detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchTerm || filterEstado !== 'all' ? 
                        'No se encontraron gestiones que coincidan con tu búsqueda' :
                        'No hay gestiones disponibles'
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
