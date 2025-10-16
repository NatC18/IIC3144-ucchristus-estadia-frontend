import { useState } from 'react'
import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { pacientes, type Paciente } from '@/data/mockData'

function getHospitalizacionColor(hospitalizado: Paciente['hospitalizado']) {
  switch (hospitalizado) {
    case true:
      return 'bg-blue-100 text-blue-800 rounded-full whitespace-nowrap'
    case false:
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
    default:
      return 'bg-gray-100 text-gray-800 rounded-full whitespace-nowrap'
  }
}

export function PacientesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterHospitalizado, setFilterHospitalizado] = useState<string>('all')

  // Filter patients based on search and filter
  const filteredPacientes = pacientes.filter(paciente => {
    const matchesSearch = 
      paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.prevision.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterHospitalizado === 'all' || paciente.hospitalizado === (filterHospitalizado === 'hospitalizado')

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pacientes</h1>
            <p className="text-gray-600">Historial de pacientes hospitalizados en UC Christus</p>
          </div>
        </div>

        {/* Main Content - Tasks Table */}
        <Card className="rounded-xl border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Todos los pacientes</CardTitle>
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
          </CardHeader>
          <CardContent>
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
                {filteredPacientes.length > 0 ? (
                  filteredPacientes.map((paciente, index) => (
                    <TableRow key={index}>
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
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No se encontraron pacientes que coincidan con tu búsqueda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
