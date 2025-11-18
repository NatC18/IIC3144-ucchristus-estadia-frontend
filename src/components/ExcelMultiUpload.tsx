/**
 * Componente para la carga de los 3 archivos Excel requeridos
 */

import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Info
} from 'lucide-react';
import { useExcelImport } from '../hooks/useExcelImport';
import { formatFileSize } from '../services/excelImportService';

interface ExcelMultiUploadProps {
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
}

interface FileSlot {
  id: 'excel1' | 'excel2' | 'excel3' | 'excel4';
  label: string;
  description: string;
  file: File | null;
  dragActive: boolean;
}

export function ExcelMultiUpload({ onUploadSuccess, onUploadError }: ExcelMultiUploadProps) {
  const {
    isUploading,
    uploadProgress,
    uploadError,
    uploadSuccess,
    uploadResult,
    uploadFiles,
    resetUpload,
    validateExcelFile,
  } = useExcelImport();

  const [fileSlots, setFileSlots] = useState<FileSlot[]>([
    {
      id: 'excel1',
      label: 'GRD',
      description: 'Datos principales de episodios',
      file: null,
      dragActive: false,
    },
    {
      id: 'excel2',
      label: 'Gestión de Estadía',
      description: 'Información gestiones y episodios',
      file: null,
      dragActive: false,
    },
    {
      id: 'excel3',
      label: 'NWP',
      description: 'Datos complementarios sobre camas',
      file: null,
      dragActive: false,
    },
    {
      id: 'excel4',
      label: 'Score Social',
      description: 'Datos de score social de pacientes',
      file: null,
      dragActive: false,
    },
  ]);

  const updateFileSlot = useCallback((id: 'excel1' | 'excel2' | 'excel3' | 'excel4', updates: Partial<FileSlot>) => {
    setFileSlots(prev => prev.map(slot => 
      slot.id === id ? { ...slot, ...updates } : slot
    ));
  }, []);

  const handleDragEvents = useCallback((
    e: React.DragEvent,
    slotId: 'excel1' | 'excel2' | 'excel3' | 'excel4',
    isDragEnter: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    updateFileSlot(slotId, { dragActive: isDragEnter });
  }, [updateFileSlot]);

  const handleDrop = useCallback((e: React.DragEvent, slotId: 'excel1' | 'excel2' | 'excel3' | 'excel4') => {
    e.preventDefault();
    e.stopPropagation();
    
    updateFileSlot(slotId, { dragActive: false });
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateExcelFile(file)) {
        updateFileSlot(slotId, { file });
      } else {
        alert('Por favor selecciona un archivo Excel válido (.xlsx o .xls)');
      }
    }
  }, [updateFileSlot, validateExcelFile]);

  const handleFileChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    slotId: 'excel1' | 'excel2' | 'excel3' | 'excel4'
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateExcelFile(file)) {
        updateFileSlot(slotId, { file });
      } else {
        alert('Por favor selecciona un archivo Excel válido (.xlsx o .xls)');
      }
    }
  }, [updateFileSlot, validateExcelFile]);

  const removeFile = useCallback((slotId: 'excel1' | 'excel2' | 'excel3' | 'excel4') => {
    updateFileSlot(slotId, { file: null });
  }, [updateFileSlot]);

  const handleUpload = useCallback(async () => {
    const excel1 = fileSlots.find(slot => slot.id === 'excel1')?.file;
    const excel2 = fileSlots.find(slot => slot.id === 'excel2')?.file;
    const excel3 = fileSlots.find(slot => slot.id === 'excel3')?.file;
    const excel4 = fileSlots.find(slot => slot.id === 'excel4')?.file;

    if (!excel1 || !excel2 || !excel3 || !excel4) {
      alert('Por favor selecciona los 4 archivos Excel antes de continuar');
      return;
    }

    try {
      await uploadFiles(excel1, excel2, excel3, excel4);
      onUploadSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      onUploadError?.(errorMessage);
    }
  }, [fileSlots, uploadFiles, onUploadSuccess, onUploadError]);

  const allFilesSelected = fileSlots.every(slot => slot.file !== null);
  const canUpload = allFilesSelected && !isUploading;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FileSpreadsheet className="h-8 w-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Importación de Archivos Excel
          </h2>
        </div>
        <p className="text-gray-600">
          Sube los 4 archivos Excel requeridos para importar los datos a la base de datos
        </p>
      </div>

      {/* Información importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información importante:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Los archivos deben estar en formato Excel (.xlsx o .xls)</li>
              <li>Asegúrate de que los datos estén correctamente estructurados</li>
              <li>Los episodios se vincularán por el número CMBD entre archivos</li>
              <li>El proceso puede tomar varios minutos dependiendo del tamaño</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Slots para archivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {fileSlots.map((slot) => (
          <div key={slot.id} className="space-y-3">
            <div className="text-center">
              <h3 className="font-medium text-gray-900">{slot.label}</h3>
              <p className="text-sm text-gray-500">{slot.description}</p>
            </div>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                slot.dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : slot.file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={(e) => handleDragEvents(e, slot.id, true)}
              onDragLeave={(e) => handleDragEvents(e, slot.id, false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, slot.id)}
            >
              {slot.file ? (
                <div className="space-y-3">
                  <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {slot.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(slot.file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(slot.id)}
                    className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Arrastra tu archivo aquí o{' '}
                      <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                        <span>selecciona uno</span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".xlsx,.xls"
                          onChange={(e) => handleFileChange(e, slot.id)}
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-400">
                      Solo archivos Excel (.xlsx, .xls)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Barra de progreso */}
      {isUploading && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Procesando archivos...
            </span>
            <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Mensajes de estado */}
      {uploadError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Error en la importación</h4>
              <p className="text-sm text-red-700 mt-1">{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      {uploadSuccess && uploadResult && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800">¡Importación exitosa!</h4>
              <p className="text-sm text-green-700 mt-1">{uploadResult.message}</p>
              {uploadResult.data && (
                <p className="text-xs text-green-600 mt-2">
                  Archivos procesados: {uploadResult.data.files_processed.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={resetUpload}
          disabled={isUploading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Limpiar
        </button>
        
        <button
          onClick={handleUpload}
          disabled={!canUpload}
          className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Importar Archivos
            </>
          )}
        </button>
      </div>
    </div>
  );
}