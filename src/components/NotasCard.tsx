import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Nota } from '@/types'
import { Trash2, Plus, Loader2, Check, AlertTriangle } from 'lucide-react'

interface NotasCardProps {
  gestionId: string
  notas: Nota[]
  onCreateNota: (descripcion: string) => Promise<void>
  onDeleteNota: (notaId: string) => Promise<void>
  onMarkAsLista: (notaId: string) => Promise<void>
  loading?: boolean
}

export function NotasCard({ notas, onCreateNota, onDeleteNota, onMarkAsLista, loading = false }: Omit<NotasCardProps, 'gestionId'>) {
  const [isAdding, setIsAdding] = useState(false)
  const [newNotaText, setNewNotaText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // Sort notas: Non-'Lista' first, then 'Lista', both ordered by date descending
  const sortedNotas = [...notas].sort((a, b) => {
    const aIsLista = a.estado?.toLowerCase() === 'lista'
    const bIsLista = b.estado?.toLowerCase() === 'lista'

    if (aIsLista && !bIsLista) return 1
    if (!aIsLista && bIsLista) return -1
    
    return new Date(b.fecha_nota).getTime() - new Date(a.fecha_nota).getTime()
  })

  const handleAddNota = async () => {
    if (!newNotaText.trim()) return

    setIsSaving(true)
    try {
      await onCreateNota(newNotaText)
      setNewNotaText('')
      setIsAdding(false)
    } catch (err) {
      console.error('Error adding nota:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteNota = async (notaId: string) => {
    setDeletingId(notaId)
    try {
      await onDeleteNota(notaId)
      setConfirmDeleteId(null)
    } catch (err) {
      console.error('Error deleting nota:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleConfirmDelete = (notaId: string) => {
    setConfirmDeleteId(notaId)
  }

  const handleCancelDelete = () => {
    setConfirmDeleteId(null)
  }

  const handleMarkAsLista = async (notaId: string) => {
    setUpdatingId(notaId)
    try {
      await onMarkAsLista(notaId)
    } catch (err) {
      console.error('Error updating nota:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'lista':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  return (
    <Card className="rounded-xl border-0 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Notas de la Gestión</CardTitle>
        {!isAdding && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(true)}
            className="text-[#671E75] hover:bg-purple-50"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Nota Form */}
        {isAdding && (
          <div className="space-y-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <textarea
              value={newNotaText}
              onChange={(e) => setNewNotaText(e.target.value)}
              placeholder="Escribe una nueva nota..."
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#671E75] focus:border-transparent text-sm resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddNota}
                disabled={isSaving || !newNotaText.trim()}
                className="text-white hover:text-white"
                style={{ backgroundColor: '#671E75' }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAdding(false)
                  setNewNotaText('')
                }}
                disabled={isSaving}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Display Notas */}
        {sortedNotas.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">No hay notas registradas</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedNotas.map((nota) => (
              <div key={nota.id}>
                <div
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {nota.usuario_nombre || 'Usuario desconocido'}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(nota.fecha_nota)}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleConfirmDelete(nota.id)}
                        disabled={deletingId === nota.id || confirmDeleteId === nota.id}
                        className="text-red-600 hover:bg-red-50 h-auto p-1"
                      >
                        {deletingId === nota.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 break-words">{nota.descripcion}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      {nota.estado && (
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getEstadoBadgeColor(nota.estado)}`}>
                          {capitalizeFirstLetter(nota.estado)}
                        </span>
                      )}
                    </div>
                    
                    {nota.estado?.toLowerCase() !== 'lista' && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsLista(nota.id)}
                          disabled={updatingId === nota.id}
                          className="text-white hover:text-white shadow-sm"
                          style={{ backgroundColor: '#671E75' }}
                        >
                          {updatingId === nota.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-2" />
                          ) : (
                            <Check className="h-3 w-3 mr-2" />
                          )}
                          Marcar como Lista
                        </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="rounded-xl border-0 max-w-md w-full mx-4 shadow-lg bg-white">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Confirmar Eliminación</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">¿Está seguro de que desea eliminar esta nota? Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => confirmDeleteId && handleDeleteNota(confirmDeleteId)}
                  disabled={!!deletingId}
                  className="flex-1 text-white hover:text-white"
                  style={{ backgroundColor: '#D32F2F' }}
                >
                  {deletingId ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar'
                  )}
                </Button>
                <Button
                  onClick={handleCancelDelete}
                  disabled={!!deletingId}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  )
}
