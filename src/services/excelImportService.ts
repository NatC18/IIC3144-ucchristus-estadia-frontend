/**
 * Servicio para la importación de archivos Excel locales
 * Maneja la carga de los 3 archivos Excel requeridos (excel1, excel2, excel3)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

export interface ExcelImportResponse {
  success: boolean;
  message: string;
  data?: {
    files_processed: string[];
    temp_dir?: string;
  };
  error?: string;
}

export interface ImportStatusResponse {
  success: boolean;
  data?: {
    pacientes: number;
    episodios: number;
    gestiones: number;
  };
  error?: string;
  message?: string;
}

export interface ExcelFile {
  file: File;
  type: 'excel1' | 'excel2' | 'excel3';
  name: string;
}

/**
 * Obtiene el token de autenticación desde localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

/**
 * Sube los 3 archivos Excel al servidor para su procesamiento
 */
export const uploadExcelFiles = async (
  excel1: File,
  excel2: File,
  excel3: File
): Promise<ExcelImportResponse> => {
  const token = getAuthToken();
  
  const formData = new FormData();
  formData.append('excel1', excel1);
  formData.append('excel2', excel2);
  formData.append('excel3', excel3);

  try {
    const response = await fetch(`${API_BASE_URL}/excel/import/`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error del servidor: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error uploading Excel files:', error);
    throw error;
  }
};

/**
 * Obtiene el estado actual de la importación (estadísticas de la base de datos)
 */
export const getImportStatus = async (): Promise<ImportStatusResponse> => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_BASE_URL}/excel/import/status/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error del servidor: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting import status:', error);
    throw error;
  }
};

/**
 * Valida que un archivo sea un archivo Excel válido
 */
export const validateExcelFile = (file: File): boolean => {
  const validExtensions = ['.xlsx', '.xls'];
  const validMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  const isValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  const isValidMimeType = validMimeTypes.includes(file.type);

  return isValidExtension || isValidMimeType;
};

/**
 * Obtiene el tamaño del archivo en formato legible
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Genera un nombre de archivo sugerido basado en el tipo
 */
export const getSuggestedFileName = (type: 'excel1' | 'excel2' | 'excel3'): string => {
  const suggestions = {
    excel1: 'pacientes_episodios.xlsx',
    excel2: 'datos_adicionales.xlsx',
    excel3: 'informacion_complementaria.xlsx'
  };

  return suggestions[type];
};