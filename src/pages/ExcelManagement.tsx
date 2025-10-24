/**
 * Página principal para la gestión de archivos Excel
 * Integra la carga de múltiples archivos Excel y el monitoreo de estadísticas
 */

import { useState } from 'react';
import { FileSpreadsheet, Upload, BarChart3 } from 'lucide-react';
import { Header } from '../components/Header';
import { ExcelMultiUpload } from '../components/ExcelMultiUpload';
import { ImportStats } from '../components/ImportStats';

export function ExcelManagementPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'stats'>('upload');

  // Cuando se sube un archivo exitosamente, cambiar a la pestaña de estadísticas
  const handleUploadSuccess = () => {
    setActiveTab('stats');
  };

  const tabs = [
    {
      key: 'upload' as const,
      label: 'Subir Archivos',
      icon: Upload,
      description: 'Cargar los 3 archivos Excel requeridos'
    },
    {
      key: 'stats' as const,
      label: 'Estadísticas',
      icon: BarChart3,
      description: 'Ver estadísticas de importación'
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
            <ExcelMultiUpload onUploadSuccess={handleUploadSuccess} />
          )}
          
          {activeTab === 'stats' && (
            <ImportStats />
          )}
        </div>
      </div>

      {/* Footer con información adicional */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Archivos Requeridos</h4>
              <p>Debes subir exactamente 3 archivos Excel (.xlsx, .xls) con datos distribuidos que se crucen por episodio CMBD</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Procesamiento</h4>
              <p>Los archivos se procesan inmediatamente. El sistema cruza los datos automáticamente y pobla la base de datos.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Estadísticas</h4>
              <p>Puedes ver las estadísticas de importación en tiempo real después de cada carga exitosa.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}