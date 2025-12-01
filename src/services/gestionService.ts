/**
 * Servicio para gestiones
 * Maneja operaciones CRUD y exportación de gestiones
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api'

export const GestionService = {
  /**
   * Exporta las gestiones a Excel
   */
  async exportarExcel(): Promise<Blob> {
    const token = localStorage.getItem('access_token')
    
    const response = await fetch(`${API_BASE_URL}/gestiones/exportar-excel/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Error al exportar gestiones a Excel')
    }

    return await response.blob()
  },

  /**
   * Descarga un blob como archivo
   */
  descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = nombreArchivo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}
