import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { estadisticasTareas, estadisticasBarreras, tendenciaEstadia } from '@/data/mockData'

const COLORS = ['#671E75', '#3180E2', '#BE98BE', '#f59e0b', '#ef4444']

export function EstadisticasTareasChart() {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Estado de Tareas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={estadisticasTareas}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="cantidad"
            >
              {estadisticasTareas.map((_, index) => (
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
      </CardContent>
    </Card>
  )
}

export function TiposBarreraChart() {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tipos de Barreras</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={estadisticasBarreras}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="barrera" 
              tick={{ fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
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
      </CardContent>
    </Card>
  )
}

export function TendenciaEstadiaChart() {
  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tendencia de Estadía</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={tendenciaEstadia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="dia" 
              tick={{ fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
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
      </CardContent>
    </Card>
  )
}
