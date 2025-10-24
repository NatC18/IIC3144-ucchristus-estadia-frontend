/**
 * Componente para mostrar el estado de procesamiento de archivos
 */

import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload, 
  AlertTriangle, 
  Loader2,
  FileText,
  Database
} from 'lucide-react';
import { useFileStatusPolling } from '../hooks/useExcelUpload';
import { ArchivoStatus } from '../services/excelUploadService';

interface FileStatusProps {
  archivoId: string;
  onComplete?: (status: ArchivoStatus) => void;
}

const ESTADO_CONFIG = {
  SUBIDO: {
    icon: Upload,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    label: 'Subido',
    description: 'Archivo subido correctamente, esperando procesamiento'
  },
  PROCESANDO: {
    icon: Loader2,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    label: 'Procesando',
    description: 'Procesando datos del archivo'
  },
  COMPLETADO: {
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50 border-green-200',
    label: 'Completado',
    description: 'Procesamiento completado exitosamente'
  },
  ERROR: {
    icon: XCircle,
    color: 'text-red-600 bg-red-50 border-red-200',
    label: 'Error',
    description: 'Error durante el procesamiento'
  },
  PARCIAL: {
    icon: AlertTriangle,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    label: 'Parcial',
    description: 'Procesamiento completado con algunos errores'
  }
};

export function FileStatusComponent({ archivoId, onComplete }: FileStatusProps) {
  const { 
    status, 
    error, 
    isPolling,
    hasTimedOut,
    startPolling, 
    stopPolling, 
    refetch 
  } = useFileStatusPolling(
    archivoId,
    3000, // Incrementar intervalo a 3 segundos
    300000, // 5 minutos de timeout
    (status) => {
      const isComplete = ['COMPLETADO', 'ERROR', 'PARCIAL'].includes(status.archivo.estado);
      if (isComplete && onComplete) {
        onComplete(status);
      }
      return isComplete;
    }
  );

  React.useEffect(() => {
    if (archivoId) {
      startPolling();
    }
    return () => stopPolling();
  }, [archivoId, startPolling, stopPolling]);

  // Manejo del timeout
  if (hasTimedOut) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-800">Tiempo de espera agotado</h3>
          </div>
          <button
            onClick={() => {
              refetch();
              startPolling();
            }}
            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
        <p className="mt-2 text-sm text-yellow-700">
          El procesamiento está tomando más tiempo del esperado. 
          Puedes actualizar manualmente o el archivo podría estar procesándose aún.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-800">Error al obtener estado</h3>
          </div>
          <button
            onClick={refetch}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          <span className="text-gray-600">Cargando estado...</span>
        </div>
      </div>
    );
  }

  const { archivo } = status;
  const estadoConfig = ESTADO_CONFIG[archivo.estado];
  const Icon = estadoConfig.icon;

  const progressPercentage = archivo.filas_totales > 0 
    ? (archivo.filas_procesadas / archivo.filas_totales) * 100 
    : 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        {/* Header con estado */}
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${estadoConfig.color}`}>
          <Icon className={`h-6 w-6 ${archivo.estado === 'PROCESANDO' ? 'animate-spin' : ''}`} />
          <div className="flex-1">
            <h3 className="font-semibold">{estadoConfig.label}</h3>
            <p className="text-sm opacity-90">{estadoConfig.description}</p>
          </div>
          {isPolling && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Actualizando...</span>
            </div>
          )}
        </div>

        {/* Información del archivo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Archivo</span>
            </div>
            <p className="text-sm text-gray-600">{archivo.nombre}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tipo</span>
            </div>
            <p className="text-sm text-gray-600">{archivo.tipo}</p>
          </div>
        </div>

        {/* Progreso de procesamiento */}
        {archivo.filas_totales > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Progreso de procesamiento
              </span>
              <span className="text-sm text-gray-600">
                {archivo.filas_procesadas} / {archivo.filas_totales} filas
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Exitosas</span>
            </div>
            <p className="text-lg font-bold text-green-800">{archivo.filas_exitosas}</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">Errores</span>
            </div>
            <p className="text-lg font-bold text-red-800">{archivo.filas_errores}</p>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Total</span>
            </div>
            <p className="text-lg font-bold text-blue-800">{archivo.filas_totales}</p>
          </div>
        </div>

        {/* Lista de errores */}
        {archivo.errores && archivo.errores.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Errores encontrados</h4>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {archivo.errores.map((error, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-800">
                      Fila {error.fila}
                    </p>
                    <p className="text-sm text-red-700 break-words">
                      {error.error}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información temporal */}
        <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Subido: {new Date(archivo.fecha_carga).toLocaleString()}</span>
            {archivo.fecha_procesamiento && (
              <span>Procesado: {new Date(archivo.fecha_procesamiento).toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { FileStatusComponent as FileStatus };