import { useState } from 'react'
import { GestionService } from '@/services/gestionService'

export function useGestionExport() {
  const [exportando, setExportando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportarExcel = async () => {
    try {
      setExportando(true)
      setError(null)
      
      const blob = await GestionService.exportarExcel()
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      GestionService.descargarArchivo(blob, `gestiones_${timestamp}.xlsx`)
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al exportar Excel'
      setError(errorMessage)
      console.error('Error exportando Excel:', err)
      return false
    } finally {
      setExportando(false)
    }
  }

  return {
    exportando,
    error,
    exportarExcel,
  }
}
