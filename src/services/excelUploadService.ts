/**
 * Servicio para la gestión de archivos Excel
 * Conecta con los endpoints del backend para subir y procesar archivos
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

export interface UploadResponse {
  success: boolean;
  message: string;
  archivo_id: string;
  estado: string;
  nombre_archivo: string;
  tipo: string;
  fecha_carga: string;
  usuario: string;
}

export interface ArchivoStatus {
  success: boolean;
  archivo: {
    id: string;
    nombre: string;
    tipo: string;
    estado: 'SUBIDO' | 'PROCESANDO' | 'COMPLETADO' | 'ERROR' | 'PARCIAL';
    porcentaje_completado: number;
    filas_totales: number;
    filas_procesadas: number;
    filas_exitosas: number;
    filas_errores: number;
    errores: Array<{
      fila: number;
      error: string;
    }>;
    fecha_carga: string;
    fecha_procesamiento: string | null;
    usuario: string;
  };
}

export interface ArchivoListItem {
  id: string;
  nombre: string;
  tipo: string;
  estado: string;
  porcentaje_completado: number;
  filas_totales: number;
  filas_procesadas: number;
  filas_exitosas: number;
  filas_errores: number;
  fecha_carga: string;
  fecha_procesamiento: string | null;
  usuario: string;
  tiene_errores: boolean;
}

export interface ArchivosListResponse {
  success: boolean;
  archivos: ArchivoListItem[];
  total: number;
}

export type TipoArchivo = 'USERS' | 'PACIENTES' | 'CAMAS' | 'EPISODIOS' | 'GESTIONES' | 'MIXTO';

class ExcelUploadService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
      
      // Agregar código de estado al mensaje para mejor debugging
      throw new Error(`${errorMessage} (${response.status})`);
    }
    return response.json();
  }

  /**
   * Subir archivo Excel
   */
  async uploadFile(file: File, tipo: TipoArchivo): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipo', tipo);

    const response = await fetch(`${API_BASE_URL}/archivos/upload/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    return this.handleResponse<UploadResponse>(response);
  }

  /**
   * Obtener estado de procesamiento de un archivo
   */
  async getFileStatus(archivoId: string): Promise<ArchivoStatus> {
    const response = await fetch(`${API_BASE_URL}/archivos/status/${archivoId}/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ArchivoStatus>(response);
  }

  /**
   * Obtener lista de archivos subidos
   */
  async getFilesList(): Promise<ArchivosListResponse> {
    const response = await fetch(`${API_BASE_URL}/archivos/upload/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<ArchivosListResponse>(response);
  }

  /**
   * Descargar plantilla Excel
   */
  async downloadTemplate(tipo: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/excel/plantilla/${tipo}/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al descargar plantilla: ${response.status}`);
    }

    return response.blob();
  }

  /**
   * Descargar plantilla y guardar archivo
   */
  async downloadAndSaveTemplate(tipo: string): Promise<void> {
    try {
      const blob = await this.downloadTemplate(tipo);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `plantilla_${tipo.toLowerCase()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar plantilla:', error);
      throw error;
    }
  }
}

export const excelUploadService = new ExcelUploadService();