/**
 * Página principal para la gestión de archivos Excel
 * Integra la carga de archivos, el monitoreo de estado y la lista de archivos
 */

import { useState } from 'react';
import { FileSpreadsheet, Upload, List, BarChart3 } from 'lucide-react';
import { Header } from '../components/Header';
import { FileUpload } from '../components/FileUpload';
import { FileStatus } from '../components/FileStatus';
import { FilesListComponent } from '../components/FilesList';

export function ExcelManagementPage() {
  const [currentArchivoId, setCurrentArchivoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'status' | 'list'>('upload');

  // Cuando se sube un archivo exitosamente, cambiar a la pestaña de estado
  const handleUploadSuccess = (archivoId: string) => {
    setCurrentArchivoId(archivoId);
    setActiveTab('status');
  };

  // Para ver el estado de un archivo desde la lista
  const handleViewFileStatus = (archivoId: string) => {
    setCurrentArchivoId(archivoId);
    setActiveTab('status');
  };

  const tabs = [
    {
      key: 'upload' as const,
      label: 'Subir Archivo',
      icon: Upload,
      description: 'Cargar nuevos archivos Excel'
    },
    {
      key: 'status' as const,
      label: 'Estado',
      icon: BarChart3,
      description: 'Monitorear procesamiento'
    },
    {
      key: 'list' as const,
      label: 'Historial',
      icon: List,
      description: 'Ver archivos subidos'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de navegación principal */}
      <Header />
      
      {/* Título de la página */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Gestión de Archivos Excel
              </h1>
              <p className="text-sm text-gray-500">
                Carga y procesa archivos Excel para poblar la base de datos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Description */}
        <div className="mb-6">
          <p className="text-gray-600">
            {tabs.find(tab => tab.key === activeTab)?.description}
          </p>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'upload' && (
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          )}
          
          {activeTab === 'status' && (
            <div>
              {currentArchivoId ? (
                <FileStatus archivoId={currentArchivoId} />
              ) : (
                <div className="text-center p-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona un archivo
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Sube un archivo desde la pestaña "Subir Archivo" o selecciona uno del historial
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Ir a Subir Archivo
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'list' && (
            <FilesListComponent onViewFile={handleViewFileStatus} />
          )}
        </div>
      </div>

      {/* Footer con información adicional */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Formatos Soportados</h4>
              <p>Archivos Excel (.xlsx, .xls) con datos de usuarios, productos o ambos</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Procesamiento</h4>
              <p>Los archivos se procesan en segundo plano. Puedes monitorear el progreso en tiempo real.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Permisos</h4>
              <p>Esta funcionalidad está disponible solo para usuarios administradores.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}