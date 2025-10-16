import { useState } from 'react'
import { Header } from '@/components/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { tareasPendientes, type TareaPendiente } from '@/data/mockData'

function getEstadoColor(estado: TareaPendiente['estado']) {
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

export function GestionesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('all')

  // Filter tasks based on search and filter
  const filteredTareas = tareasPendientes.filter(tarea => {
    const matchesSearch = 
      tarea.episodio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.tipoBarrera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterEstado === 'all' || tarea.estado === filterEstado

    return matchesSearch && matchesFilter
  })

  // Statistics
  const totalTareas = tareasPendientes.length
  const abiertas = tareasPendientes.filter(t => t.estado === 'Abierta').length
  const enProceso = tareasPendientes.filter(t => t.estado === 'En proceso').length
  const cerradas = tareasPendientes.filter(t => t.estado === 'Cerrada').length

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestiones</h1>
            <p className="text-gray-600">Gestión de tareas y barreras hospitalarias</p>
          </div>
          <Button 
            onClick={() => navigate('/gestiones/create')}
            className="flex items-center gap-2 text-white hover:text-white"
            style={{ backgroundColor: '#671E75' }}
          >
            <Plus className="h-4 w-4" />
            Nueva Gestión
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border-0">
            <div className="flex items-center">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#f3e8ff' }}>
                <svg className="w-6 h-6" style={{ color: '#671E75' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Gestiones</p>
                <p className="text-2xl font-bold text-gray-900">{totalTareas}</p>
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
                <p className="text-sm font-medium text-gray-600">Abiertas</p>
                <p className="text-2xl font-bold text-gray-900">{abiertas}</p>
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
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">{enProceso}</p>
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
                <p className="text-sm font-medium text-gray-600">Cerradas</p>
                <p className="text-2xl font-bold text-gray-900">{cerradas}</p>
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
                    placeholder="Buscar por episodio, barrera..." 
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
                    <option value="Abierta">Abierta</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Cerrada">Cerrada</option>
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
                  <TableHead>Tipo de Barrera</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTareas.length > 0 ? (
                  filteredTareas.map((tarea, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{tarea.episodio}</TableCell>
                      <TableCell>{tarea.tipoBarrera}</TableCell>
                      <TableCell>{tarea.descripcion}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getEstadoColor(tarea.estado)}
                        >
                          {tarea.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-[#671E75] hover:bg-purple-50">
                          Ver detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No se encontraron gestiones que coincidan con tu búsqueda
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
