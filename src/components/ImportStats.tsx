/**
 * Componente para mostrar estadísticas de importación
 */

import { useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Briefcase, 
  RefreshCw, 
  TrendingUp,
  Database
} from 'lucide-react';
import { useExcelImport } from '../hooks/useExcelImport';

export function ImportStats() {
  const {
    isLoadingStatus,
    stats,
    statusError,
    fetchStatus,
    resetStatus,
  } = useExcelImport();

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleRefresh = () => {
    resetStatus();
    fetchStatus();
  };

  const statsItems = [
    {
      title: 'Pacientes',
      value: stats?.pacientes || 0,
      icon: Users,
      color: 'blue',
      description: 'Total de pacientes en el sistema',
    },
    {
      title: 'Episodios',
      value: stats?.episodios || 0,
      icon: FileText,
      color: 'green',
      description: 'Episodios médicos registrados',
    },
    {
      title: 'Gestiones',
      value: stats?.gestiones || 0,
      icon: Briefcase,
      color: 'purple',
      description: 'Gestiones administrativas',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        icon: 'text-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        icon: 'text-green-600',
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        icon: 'text-purple-600',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (statusError) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Database className="h-8 w-8 text-red-600" />
              <h3 className="text-lg font-medium text-red-800">
                Error al obtener estadísticas
              </h3>
            </div>
            <p className="text-sm text-red-700 mb-4">{statusError}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-gray-700" />
          <h3 className="text-xl font-semibold text-gray-900">
            Estadísticas de Importación
          </h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoadingStatus}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isLoadingStatus ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {isLoadingStatus && !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {statsItems.map((item) => {
              const Icon = item.icon;
              const colors = getColorClasses(item.color);
              
              return (
                <div key={item.title} className={`${colors.bg} rounded-lg p-6 border`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                    <span className={`text-sm font-medium ${colors.text}`}>
                      {item.title}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className={`text-3xl font-bold ${colors.text}`}>
                      {item.value.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen total */}
          <div className="bg-gray-50 rounded-lg p-6 border">
            <div className="text-center">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Resumen Total
              </h4>
              <p className="text-3xl font-bold text-gray-700 mb-2">
                {(
                  (stats?.pacientes || 0) + 
                  (stats?.episodios || 0) + 
                  (stats?.gestiones || 0)
                ).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Registros totales en la base de datos
              </p>
            </div>
          </div>

          {!stats && (
            <div className="text-center py-8">
              <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No hay datos disponibles
              </h4>
              <p className="text-gray-600 mb-4">
                Las estadísticas aparecerán después de realizar una importación
              </p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Cargar Estadísticas
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}