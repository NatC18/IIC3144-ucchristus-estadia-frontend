/**
 * Hooks personalizados para el manejo de archivos Excel
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  excelUploadService, 
  UploadResponse, 
  ArchivoStatus, 
  ArchivosListResponse,
  TipoArchivo 
} from '../services/excelUploadService';

export interface UseFileUploadState {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  success: boolean;
  uploadResult: UploadResponse | null;
}

export interface UseFileStatusState {
  isLoading: boolean;
  status: ArchivoStatus | null;
  error: string | null;
}

export interface UseFilesListState {
  isLoading: boolean;
  files: ArchivosListResponse | null;
  error: string | null;
}

/**
 * Hook para subir archivos Excel
 */
export function useFileUpload() {
  const [state, setState] = useState<UseFileUploadState>({
    isUploading: false,
    uploadProgress: 0,
    error: null,
    success: false,
    uploadResult: null,
  });

  const uploadFile = useCallback(async (file: File, tipo: TipoArchivo) => {
    setState(prev => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      error: null,
      success: false,
      uploadResult: null,
    }));

    try {
      // Simular progreso de subida
      setState(prev => ({ ...prev, uploadProgress: 30 }));
      
      const result = await excelUploadService.uploadFile(file, tipo);
      
      setState(prev => ({ ...prev, uploadProgress: 100 }));
      
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isUploading: false,
          success: true,
          uploadResult: result,
        }));
      }, 500);

      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      uploadProgress: 0,
      error: null,
      success: false,
      uploadResult: null,
    });
  }, []);

  return {
    ...state,
    uploadFile,
    reset,
  };
}

/**
 * Hook para obtener el estado de un archivo
 */
export function useFileStatus(archivoId: string | null) {
  const [state, setState] = useState<UseFileStatusState>({
    isLoading: false,
    status: null,
    error: null,
  });

  const fetchStatus = useCallback(async () => {
    if (!archivoId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const status = await excelUploadService.getFileStatus(archivoId);
      setState(prev => ({
        ...prev,
        isLoading: false,
        status,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  }, [archivoId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    ...state,
    refetch: fetchStatus,
  };
}

/**
 * Hook para obtener la lista de archivos
 */
export function useFilesList(autoFetch = true) {
  const [state, setState] = useState<UseFilesListState>({
    isLoading: false,
    files: null,
    error: null,
  });

  const fetchFiles = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const files = await excelUploadService.getFilesList();
      setState(prev => ({
        ...prev,
        isLoading: false,
        files,
      }));
    } catch (error) {
      let errorMessage = 'Error desconocido';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
        } else if (error.message.includes('403')) {
          errorMessage = 'No tienes permisos para ver los archivos.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchFiles();
    }
  }, [autoFetch, fetchFiles]);

  return {
    ...state,
    refetch: fetchFiles,
  };
}

/**
 * Hook para polling del estado de un archivo con timeout y mejor manejo de estados
 */
export function useFileStatusPolling(
  archivoId: string | null, 
  interval = 3000,
  maxDuration = 300000, // 5 minutos máximo
  stopWhen?: (status: ArchivoStatus) => boolean
) {
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const { status, error, refetch } = useFileStatus(archivoId);

  const startPolling = useCallback(() => {
    setIsPolling(true);
    setPollCount(0);
    setHasTimedOut(false);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  // Estados finales que deben parar el polling automáticamente
  const isFinalState = useCallback((status: ArchivoStatus | null) => {
    if (!status) return false;
    return ['COMPLETADO', 'ERROR', 'PARCIAL'].includes(status.archivo.estado);
  }, []);

  useEffect(() => {
    if (!isPolling || !archivoId) return;

    const intervalId = setInterval(() => {
      setPollCount(prev => prev + 1);
      refetch();
    }, interval);

    // Timeout automático
    const timeoutId = setTimeout(() => {
      if (isPolling) {
        setHasTimedOut(true);
        setIsPolling(false);
      }
    }, maxDuration);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isPolling, archivoId, interval, maxDuration, refetch]);

  // Auto-stop en estados finales
  useEffect(() => {
    if (status && (isFinalState(status) || (stopWhen && stopWhen(status)))) {
      stopPolling();
    }
  }, [status, stopWhen, stopPolling, isFinalState]);

  return {
    status,
    error,
    isPolling,
    pollCount,
    hasTimedOut,
    startPolling,
    stopPolling,
    refetch,
  };
}

/**
 * Hook para descargar plantillas
 */
export function useTemplateDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadTemplate = useCallback(async (tipo: string) => {
    setIsDownloading(true);
    setError(null);

    try {
      await excelUploadService.downloadAndSaveTemplate(tipo);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al descargar');
      throw error;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    isDownloading,
    error,
    downloadTemplate,
  };
}