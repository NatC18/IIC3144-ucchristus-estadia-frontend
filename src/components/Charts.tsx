import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#671E75', '#3180E2', '#BE98BE', '#f59e0b', '#ef4444']

interface EstadisticaEstado {
  estado_gestion: string
  cantidad: number
}

interface EstadisticasGestion {
  tipo_gestion: string
  cantidad: number
}

interface EstadisticasTareasChartProps {
  data: EstadisticaEstado[]
  loading?: boolean
}

interface TiposGestionChartProps {
  data: EstadisticasGestion[]
  loading?: boolean
}

interface TendenciaEstadiaChartProps {
  data: Array<{ mes: string; pacientes: number }>
  loading?: boolean
}

// Mapeo de estados a labels más amigables
const estadoLabels: Record<string, string> = {
  'INICIADA': 'Abierta',
  'EN_PROGRESO': 'En proceso',
  'COMPLETADA': 'Cerrada',
  'CANCELADA': 'Cancelada',
}

export function EstadisticasTareasChart({ data, loading }: EstadisticasTareasChartProps) {
  // Transformar datos para el gráfico
  const chartData = data.map(item => ({
    name: estadoLabels[item.estado_gestion] || item.estado_gestion,
    value: item.cantidad
  }))

  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Estado de Tareas</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Cargando...</p>
        ) : chartData.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Sin datos</p>
        ) : (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    fontSize: '11px',
                    fontWeight: '500',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Leyenda personalizada debajo del gráfico */}
            <div className="flex flex-wrap gap-3 justify-center">
              {chartData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700">
                    {entry.name}: <span className="font-semibold">{entry.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function TiposGestionChart({ data, loading }: TiposGestionChartProps) {
  // Helper to format tipo_gestion to title case with spaces
  const formatTipoGestion = (tipo: string) => {
    return tipo
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(^|\s)([a-záéíóúüñ])/g, (_m, p1, p2) => p1 + p2.toUpperCase());
  };

  const chartData = data.map(item => ({
    ...item,
    tipo_gestion: formatTipoGestion(item.tipo_gestion)
  }));

  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tipos de Barrera</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Cargando...</p>
        ) : chartData.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Sin datos</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="tipo_gestion" 
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={({ x, y, payload }) => {
                  // Divide el texto en palabras (por espacios)
                  const words = payload.value.split(' ')
                  return (
                    <g transform={`translate(${x},${y + 10})`}>
                      {words.map((word: string, index: number) => (
                        <text
                          key={index}
                          x={0}
                          y={index * 12} // separa cada línea un poco
                          textAnchor="middle"
                          fontSize={10}
                          fontWeight={500}
                          fill="#374151"
                        >
                          {word}
                        </text>
                      ))}
                    </g>
                  )
                }}
              />
              <YAxis 
                tick={{ fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{
                  fontSize: '11px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="cantidad" fill="#671E75" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function TendenciaEstadiaChart({ data, loading }: TendenciaEstadiaChartProps) {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tendencia de Estadía</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Cargando...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Sin datos</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{
                  fontSize: '11px',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="pacientes" fill="#3180E2" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
