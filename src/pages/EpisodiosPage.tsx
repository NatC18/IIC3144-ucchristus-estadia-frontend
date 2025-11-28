import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Header } from '@/components/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEpisodios } from '@/hooks/useEpisodios'
import { usePacientes } from '@/hooks/usePacientes'
import { TipoAlerta } from '@/types'

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

const getAlertaLabel = (tipo: TipoAlerta): string => {
  const labels: Record<TipoAlerta, string> = {
    score_social_alto: 'Score Social Alto',
    extension_critica: 'Extensión Crítica',
    prediccion_estadia_larga: 'Predicción Estadía Larga'
  };
  return labels[tipo];
};

const getAlertaColor = (tipo: TipoAlerta): string => {
  const colors: Record<TipoAlerta, string> = {
    score_social_alto: 'bg-orange-100 text-orange-800 border-orange-300',
    extension_critica: 'bg-red-100 text-red-800 border-red-300',
    prediccion_estadia_larga: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };
  return colors[tipo];
};

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
  const [filtrosAlertas, setFiltrosAlertas] = useState<(TipoAlerta | 'sin_alertas')[]>([])
  const [showAlertasDropdown, setShowAlertasDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [tooltipState, setTooltipState] = useState<{
    show: boolean
    text: string
    x: number
    y: number
  }>({ show: false, text: '', x: 0, y: 0 })

  // Filtrar episodios según búsqueda, estado y alertas
  const allFilteredEpisodios = episodiosConNombre?.filter(ep => {
    const matchesSearch =
      ep.episodio_cmbd?.toString().includes(searchTerm) ||
      ep.paciente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ep.especialidad?.toLowerCase().includes(searchTerm.toLowerCase())

    const activo = !ep.fecha_egreso
    const estado = activo ? 'Activo' : 'Egresado'
    const matchesFilter = filterEstado === 'all' || estado === filterEstado

    // Si no hay filtros de alertas seleccionados, mostrar todos
    if (filtrosAlertas.length === 0) {
      return matchesSearch && matchesFilter
    }

    // Verificar si tiene sin alertas
    const tieneAlertasVacio = !ep.alertas || ep.alertas.length === 0
    const matchesSinAlertas = filtrosAlertas.includes('sin_alertas') && tieneAlertasVacio
    
    // Verificar si tiene alguna de las alertas seleccionadas
    const alertasReales = filtrosAlertas.filter(f => f !== 'sin_alertas') as TipoAlerta[]
    const matchesConAlertas = alertasReales.length > 0 && ep.alertas && 
      alertasReales.some(filtro => ep.alertas?.includes(filtro))

    const matchesAlertas = matchesSinAlertas || matchesConAlertas

    return matchesSearch && matchesFilter && matchesAlertas
  }) || []

  // Calcular totales y paginación
  const totalCount = allFilteredEpisodios.length
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const filteredEpisodios = allFilteredEpisodios.slice(startIndex, endIndex)

  // Resetear a página 1 cuando cambien los filtros
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  // Estadísticas
  const total = episodios?.length || 0
  const activos = episodios?.filter(e => !e.fecha_egreso).length || 0
  const egresados = episodios?.filter(e => e.fecha_egreso).length || 0

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Episodios</h1>
              <p className="text-gray-600">Monitoreo y gestión de episodios clínicos</p>
            </div>
          </div>
          
          {/* Leyenda del semáforo */}
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm inline-block">
            <div className="flex items-center gap-4 text-xs">
              <span className="font-medium text-gray-700">Semáforo de riesgo:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-gray-600">&lt;30%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <span className="text-gray-600">30-45%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-gray-600">≥45%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                <span className="text-gray-600">Extendido o egresado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#f3e8ff' }}>
                <svg className="w-6 h-6" style={{ color: '#671E75' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Episodios</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#FBF2CC' }}>
                <svg className="w-6 h-6" style={{ color: '#E3AE00' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{activos}</p>
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
                <p className="text-sm font-medium text-gray-600">Egresados</p>
                <p className="text-2xl font-bold text-gray-900">{egresados}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla principal */}
        <div className="bg-white rounded-xl border-0 overflow-visible">
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
                {/* Filtro Estado */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#671E75]"
                    value={filterEstado}
                    onChange={(e) => {
                      setFilterEstado(e.target.value)
                      handleFilterChange()
                    }}
                  >
                    <option value="all">Todos</option>
                    <option value="Activo">Activos</option>
                    <option value="Egresado">Egresados</option>
                  </select>
                </div>
                {/* Filtro Alertas */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-[#671E75] text-white rounded-lg text-sm hover:bg-[#551960] focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:ring-offset-2 transition-colors shadow-sm"
                    onClick={() => setShowAlertasDropdown(!showAlertasDropdown)}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Filtrar Alertas</span>
                    {filtrosAlertas.length > 0 && (
                      <span className="bg-white text-[#671E75] text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        {filtrosAlertas.length}
                      </span>
                    )}
                  </button>
                  
                  {showAlertasDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowAlertasDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-2">
                        <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={filtrosAlertas.includes('score_social_alto')}
                            onChange={(e) => {
                              setFiltrosAlertas(prev => 
                                e.target.checked 
                                  ? [...prev, 'score_social_alto']
                                  : prev.filter(a => a !== 'score_social_alto')
                              )
                              handleFilterChange()
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#671E75] focus:ring-[#671E75]"
                          />
                          <span className="text-sm text-gray-700">Score Social Alto</span>
                        </label>
                        <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={filtrosAlertas.includes('extension_critica')}
                            onChange={(e) => {
                              setFiltrosAlertas(prev => 
                                e.target.checked 
                                  ? [...prev, 'extension_critica']
                                  : prev.filter(a => a !== 'extension_critica')
                              )
                              handleFilterChange()
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#671E75] focus:ring-[#671E75]"
                          />
                          <span className="text-sm text-gray-700">Extensión Crítica</span>
                        </label>
                        <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={filtrosAlertas.includes('prediccion_estadia_larga')}
                            onChange={(e) => {
                              setFiltrosAlertas(prev => 
                                e.target.checked 
                                  ? [...prev, 'prediccion_estadia_larga']
                                  : prev.filter(a => a !== 'prediccion_estadia_larga')
                              )
                              handleFilterChange()
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#671E75] focus:ring-[#671E75]"
                          />
                          <span className="text-sm text-gray-700">Predicción Estadía Larga</span>
                        </label>
                        <div className="border-t border-gray-200 my-2"></div>
                        <label className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={filtrosAlertas.includes('sin_alertas')}
                            onChange={(e) => {
                              setFiltrosAlertas(prev => 
                                e.target.checked 
                                  ? [...prev, 'sin_alertas']
                                  : prev.filter(a => a !== 'sin_alertas')
                              )
                              handleFilterChange()
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#671E75] focus:ring-[#671E75]"
                          />
                          <span className="text-sm text-gray-700">Sin Alertas</span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-visible">
            {isLoading ? (
              <p className="text-center text-gray-500">Cargando episodios...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error al cargar episodios</p>
            ) : (
              <div className="overflow-visible">
                <div className="overflow-x-auto overflow-y-visible">
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">Riesgo</TableHead>
                      <TableHead>CMBD</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Especialidad</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-48">Alertas</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {filteredEpisodios.length > 0 ? (
                    filteredEpisodios.map((ep) => {
                      const estado = ep.fecha_egreso ? 'Egresado' : 'Activo'
                      
                      // Obtener color del semáforo
                      const getSemaforoColor = () => {
                        if (!ep.semaforo_riesgo) return 'bg-gray-400'
                        switch (ep.semaforo_riesgo.color) {
                          case 'red': return 'bg-red-500'
                          case 'yellow': return 'bg-yellow-400'
                          case 'green': return 'bg-green-500'
                          case 'gray': return 'bg-gray-400'
                          default: return 'bg-gray-400'
                        }
                      }
                      
                      const getSemaforoTitle = () => {
                        if (!ep.semaforo_riesgo) return 'Sin datos de probabilidad'
                        const prob = ep.semaforo_riesgo.probabilidad
                        const probText = prob !== null ? ` ${(prob * 100).toFixed(0)}%` : ''
                        
                        switch (ep.semaforo_riesgo.color) {
                          case 'red': return `Alta probabilidad de extenderse:${probText}`
                          case 'yellow': return `Media probabilidad de extenderse:${probText}`
                          case 'green': return `Baja probabilidad de extenderse:${probText}`
                          case 'gray': return ep.fecha_egreso ? 'Ya egresado' : 'Ya extendido'
                          default: return 'Sin información'
                        }
                      }
                      
                      return (
                        <TableRow key={ep.id}>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <div 
                                className={`w-3.5 h-3.5 rounded-full ${getSemaforoColor()} transition-transform duration-200 hover:scale-150 cursor-help`}
                                onMouseEnter={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect()
                                  const title = getSemaforoTitle()
                                  console.log('Tooltip text:', title) // Debug
                                  setTooltipState({
                                    show: true,
                                    text: title,
                                    x: rect.left + rect.width / 2,
                                    y: rect.top - 8
                                  })
                                }}
                                onMouseLeave={() => {
                                  setTooltipState({ show: false, text: '', x: 0, y: 0 })
                                }}
                                title={getSemaforoTitle()}
                              ></div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{ep.episodio_cmbd}</TableCell>
                          <TableCell>{ep.paciente_nombre || '—'}</TableCell>
                          <TableCell>{ep.especialidad || '—'}</TableCell>
                          <TableCell>{ep.tipo_actividad || '—'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getEstadoColor(estado)}>
                              {estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-48">
                            <div className="flex flex-col gap-1">
                              {ep.alertas && ep.alertas.length > 0 ? (
                                ep.alertas.map((alerta) => (
                                  <Badge
                                    key={alerta}
                                    variant="outline"
                                    className={`text-xs whitespace-nowrap w-fit ${getAlertaColor(alerta)}`}
                                  >
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {getAlertaLabel(alerta)}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-gray-400 text-sm">Sin alertas</span>
                              )}
                            </div>
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
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No se encontraron episodios
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                </Table>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination Controls */}
          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {totalCount > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, totalCount)} de {totalCount} episodios
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === 1 || isLoading}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages || 1}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Tooltip Portal */}
      {tooltipState.show && createPortal(
        <div 
          style={{ 
            top: `${tooltipState.y}px`, 
            left: `${tooltipState.x}px`,
            transform: 'translate(-50%, -100%)'
          }}
          className="fixed z-[9999] bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap pointer-events-none"
        >
          {tooltipState.text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>,
        document.body
      )}
    </div>
  )
}
