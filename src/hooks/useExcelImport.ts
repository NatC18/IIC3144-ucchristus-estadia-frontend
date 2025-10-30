/**
 * Hook personalizado para manejar la importación de archivos Excel
 */

import { useState, useCallback } from 'react';
import { 
  uploadExcelFiles, 
  getImportStatus, 
  validateExcelFile,
  ExcelImportResponse,
  ImportStatusResponse 
} from '../services/excelImportService';

interface ExcelImportState {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  success: boolean;
  result: ExcelImportResponse | null;
}

interface ImportStatusState {
  isLoading: boolean;
  stats: ImportStatusResponse['data'] | null;
  error: string | null;
}

export const useExcelImport = () => {
  const [state, setState] = useState<ExcelImportState>({
    isUploading: false,
    uploadProgress: 0,
    error: null,
    success: false,
    result: null,
  });

  const [statusState, setStatusState] = useState<ImportStatusState>({
    isLoading: false,
    stats: null,
    error: null,
  });

  /**
   * Sube los archivos Excel
   */
  const uploadFiles = useCallback(async (
    excel1: File,
    excel2: File,
    excel3: File
  ): Promise<ExcelImportResponse> => {
    // Validar archivos
    const files = [
      { file: excel1, name: 'Excel 1' },
      { file: excel2, name: 'Excel 2' },
      { file: excel3, name: 'Excel 3' }
    ];

    for (const { file, name } of files) {
      if (!validateExcelFile(file)) {
        const error = `${name} no es un archivo Excel válido`;
        setState(prev => ({ ...prev, error }));
        throw new Error(error);
      }
    }

    setState(prev => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      error: null,
      success: false,
      result: null,
    }));

    try {
      // Simular progreso de subida
      setState(prev => ({ ...prev, uploadProgress: 25 }));
      
      const result = await uploadExcelFiles(excel1, excel2, excel3);
      
      setState(prev => ({ 
        ...prev, 
        uploadProgress: 100,
        success: true,
        result,
        isUploading: false 
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: errorMessage,
        success: false,
      }));
      throw error;
    }
  }, []);

  /**
   * Obtiene las estadísticas de importación
   */
  const fetchStatus = useCallback(async (): Promise<ImportStatusResponse['data'] | null> => {
    setStatusState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await getImportStatus();
      
      setStatusState(prev => ({
        ...prev,
        isLoading: false,
        stats: response.data || null,
      }));

      return response.data || null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setStatusState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  /**
   * Resetea el estado de la importación
   */
  const resetUpload = useCallback(() => {
    setState({
      isUploading: false,
      uploadProgress: 0,
      error: null,
      success: false,
      result: null,
    });
  }, []);

  /**
   * Resetea el estado de las estadísticas
   */
  const resetStatus = useCallback(() => {
    setStatusState({
      isLoading: false,
      stats: null,
      error: null,
    });
  }, []);

  return {
    // Estado de subida
    isUploading: state.isUploading,
    uploadProgress: state.uploadProgress,
    uploadError: state.error,
    uploadSuccess: state.success,
    uploadResult: state.result,
    
    // Estado de estadísticas
    isLoadingStatus: statusState.isLoading,
    stats: statusState.stats,
    statusError: statusState.error,
    
    // Funciones
    uploadFiles,
    fetchStatus,
    resetUpload,
    resetStatus,
    validateExcelFile,
  };
};