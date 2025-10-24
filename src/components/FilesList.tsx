/**
 * Componente para mostrar la lista de archivos subidos
 */

import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload, 
  AlertTriangle, 
  Loader2,
  FileText,
  RotateCcw,
  Eye
} from 'lucide-react';
import { useFilesList } from '../hooks/useExcelUpload';
import { ArchivoListItem } from '../services/excelUploadService';

interface FilesListProps {
  onViewFile?: (archivoId: string) => void;
}

const ESTADO_CONFIG = {
  SUBIDO: {
    icon: Upload,
    color: 'text-blue-600',
    label: 'Subido'
  },
  PROCESANDO: {
    icon: Loader2,
    color: 'text-yellow-600',
    label: 'Procesando'
  },
  COMPLETADO: {
    icon: CheckCircle,
    color: 'text-green-600',
    label: 'Completado'
  },
  ERROR: {
    icon: XCircle,
    color: 'text-red-600',
    label: 'Error'
  },
  PARCIAL: {
    icon: AlertTriangle,
    color: 'text-orange-600',
    label: 'Parcial'
  }
};

function FileListItem({ archivo, onViewFile }: { 
  archivo: ArchivoListItem; 
  onViewFile?: (archivoId: string) => void;
}) {
  const estadoConfig = ESTADO_CONFIG[archivo.estado as keyof typeof ESTADO_CONFIG];
  const Icon = estadoConfig?.icon || FileText;
  
  const progressPercentage = archivo.filas_totales > 0 
    ? (archivo.filas_procesadas / archivo.filas_totales) * 100 
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <Icon className={`h-5 w-5 ${estadoConfig?.color} ${
              archivo.estado === 'PROCESANDO' ? 'animate-spin' : ''
            }`} />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {archivo.nombre || `Archivo ${archivo.tipo}`}
              </h3>
              <p className="text-xs text-gray-500">
                {archivo.tipo} • {estadoConfig?.label}
              </p>
            </div>
          </div>

          {/* Progreso */}
          {archivo.filas_totales > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{archivo.filas_procesadas} / {archivo.filas_totales} filas</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Estadísticas */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="text-gray-600">{archivo.filas_exitosas} exitosas</span>
            </div>
            {archivo.filas_errores > 0 && (
              <div className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-600" />
                <span className="text-gray-600">{archivo.filas_errores} errores</span>
              </div>
            )}
          </div>

          {/* Fecha */}
          <div className="mt-2 text-xs text-gray-500">
            <Clock className="inline h-3 w-3 mr-1" />
            {new Date(archivo.fecha_carga).toLocaleString()}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2 ml-4">
          {onViewFile && (
            <button
              onClick={() => onViewFile(archivo.id)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              <Eye className="h-3 w-3" />
              Ver
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function FilesListComponent({ onViewFile }: FilesListProps) {
  const { isLoading, files, error, refetch } = useFilesList();

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
        <span className="ml-2 text-gray-600">Cargando archivos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="h-5 w-5 text-red-600" />
          <h3 className="font-medium text-red-800">Error al cargar archivos</h3>
        </div>
        <p className="text-sm text-red-700 mb-3">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-1 text-sm text-red-700 hover:text-red-900 hover:bg-red-100 rounded transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    );
  }

  if (!files || files.archivos.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-sm font-medium text-gray-900 mb-2">No hay archivos</h3>
        <p className="text-sm text-gray-500">
          Aún no has subido ningún archivo Excel
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con botón de refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Archivos Subidos ({files.total})
        </h2>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {/* Lista de archivos */}
      <div className="space-y-3">
        {files.archivos.map((archivo) => (
          <FileListItem
            key={archivo.id}
            archivo={archivo}
            onViewFile={onViewFile}
          />
        ))}
      </div>
    </div>
  );
}