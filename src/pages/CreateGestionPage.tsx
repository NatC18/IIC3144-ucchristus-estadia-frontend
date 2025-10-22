import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useGestiones } from '@/hooks/useGestiones'
import { useAuth } from '@/contexts/AuthContext'





export function CreateGestionPage() {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }
    if (!user?.id) {
      setError('Error: No se pudo obtener la información del usuario')
    }
  }, [isAuthenticated, user, navigate, location])

  const episodioId = (location.state as { episodioId?: string } | null)?.episodioId
  const episodio_cmbd = (location.state as { episodio_cmbd?: string } | null)?.episodio_cmbd

  // Validate required params
  useEffect(() => {
    if (!episodioId) {
      navigate('/gestiones')
      return
    }
  }, [episodioId, navigate])

  const { createGestion } = useGestiones()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    episodio: episodioId ?? '',
    tipo_gestion: '',
    usuario: user?.id ?? '',
    informe: '',
    estado_gestion: 'INICIADA' as 'INICIADA' | 'EN_PROGRESO' | 'COMPLETADA' | 'CERRADA',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate user authentication and ID
    if (!isAuthenticated) {
      setError('Debe iniciar sesión para crear una gestión')
      setIsSubmitting(false)
      return
    }

    if (!user?.id) {
      setError('Error: No se pudo obtener la información del usuario')
      setIsSubmitting(false)
      return
    }

    // Validate required fields
    if (!formData.episodio || !formData.tipo_gestion) {
      setError('Por favor complete todos los campos requeridos')
      setIsSubmitting(false)
      return
    }

    // Gestíon no puede ser LISTADO GESTIONES
    if (formData.tipo_gestion === 'LISTADO GESTIONES') {
      setError('Debes elegir un tipo de gestión válido')
      setIsSubmitting(false)
      return
    }

    try {
      await createGestion({
        ...formData,
        usuario: user.id // Ensure we're using the latest user ID
      })
      navigate(`/episodios/${episodioId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la gestión')
      console.error('Error creating gestion:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/episodios/${episodioId}`)}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Episodio
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Gestión</h1>
          <p className="text-gray-600">Crear una nueva tarea o barrera hospitalaria</p>
        </div>

        {/* Form Card */}
        <Card className="rounded-xl border-0 max-w-3xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Información de la Gestión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Episodio */}
              <div>
                <label htmlFor="episodio" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Episodio: <span className="font-semibold">{episodio_cmbd}</span>
                </label>
              </div>

              {/* Tipo de Gestión */}
              <div>
                <label htmlFor="tipoBarrera" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Gestión<span className="text-red-500">*</span>
                </label>
                <select
                  id="tipoBarrera"
                  name="tipo_gestion"
                  required
                  value={formData.tipo_gestion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent"
                >
                  <option value="LISTADO GESTIONES">Listado Gestiones</option>
                  <option value="HOMECARE_UCCC">Homecare UCCC</option>
                  <option value="HOMECARE">Homecare</option>
                  <option value="TRASLADO">Traslado</option>
                  <option value="ACTIVACION_BENEFICIO_ISAPRE">Activación Beneficio Isapre</option>
                  <option value="AUTORIZACION_PROCEDIMIENTO">Autorización Procedimiento</option>
                  <option value="COBERTURA">Cobertura</option>
                  <option value="CORTE_CUENTAS">Corte Cuentas</option>
                  <option value="EVALUACION_OTRO_FINANCIAMIENTO">Evaluación de otro financiamiento</option>
                  <option value="ACTUALIZACION_ESTADO_PACIENTE">Actualización de estado paciente solicitado por prestadores</option>
                  <option value="ASIGNACION_CENTRO_DIALISIS">Asignación de Centro de Dialisis</option>
                  <option value="MANEJO_AMBULATORIO">Manejo ambulatorio</option>
                  <option value="INGRESO_CUIDADOS_PALIATIVOS">Ingreso de Cuidados Paliativos</option>
                  <option value="EVALUACION_BENEFICIO_GESTION_INTERNA">Evaluación de beneficio gestión interna</option>
                  <option value="GESTION_CLINICA">Gestión Clínica</option>
                </select>
              </div>

              {/* Informe */}
              <div>
                <label htmlFor="informe" className="block text-sm font-medium text-gray-700 mb-2">
                  Informe 
                </label>
                <Input
                  type="string"
                  id="informe"
                  name="informe"
                  value={formData.informe}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1 text-white hover:text-white"
                  style={{ backgroundColor: '#671E75' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creando...
                    </>
                  ) : (
                    'Crear Gestión'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/episodios/${episodioId}`)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="rounded-xl border-0 max-w-3xl mt-6 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Información importante</p>
                <p>Las gestiones creadas quedarán registradas y serán visibles para todo el equipo de gestión hospitalaria. Asegúrate de completar toda la información necesaria.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
