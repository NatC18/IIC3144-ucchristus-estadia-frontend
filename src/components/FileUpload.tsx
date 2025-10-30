/**
 * Componente para subir archivos Excel
 */

import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useFileUpload, useTemplateDownload } from '../hooks/useExcelUpload';
import { TipoArchivo } from '../services/excelUploadService';

interface FileUploadProps {
  onUploadSuccess?: (archivoId: string) => void;
  onUploadError?: (error: string) => void;
}

const TIPOS_ARCHIVO: { value: TipoArchivo; label: string; description: string }[] = [
  { 
    value: 'USERS', 
    label: 'Usuarios', 
    description: 'Cargar datos de usuarios del sistema' 
  },
  { 
    value: 'PACIENTES', 
    label: 'Pacientes', 
    description: 'Cargar información de pacientes' 
  },
  { 
    value: 'CAMAS', 
    label: 'Camas', 
    description: 'Cargar información de camas disponibles' 
  },
  { 
    value: 'EPISODIOS', 
    label: 'Episodios', 
    description: 'Cargar datos de episodios médicos' 
  },
  { 
    value: 'GESTIONES', 
    label: 'Gestiones', 
    description: 'Cargar información de gestiones administrativas' 
  },
  { 
    value: 'MIXTO', 
    label: 'Pacientes y Episodios', 
    description: 'Cargar pacientes con sus episodios asociados' 
  },
];

export function FileUploadComponent({ onUploadSuccess, onUploadError }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<TipoArchivo>('PACIENTES');
  const [dragActive, setDragActive] = useState(false);

  const { isUploading, uploadProgress, error, success, uploadResult, uploadFile, reset } = useFileUpload();
  const { isDownloading, downloadTemplate } = useTemplateDownload();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
      } else {
        alert('Por favor selecciona un archivo Excel (.xlsx o .xls)');
      }
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    try {
      const result = await uploadFile(selectedFile, selectedType);
      onUploadSuccess?.(result.archivo_id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      onUploadError?.(errorMessage);
    }
  }, [selectedFile, selectedType, uploadFile, onUploadSuccess, onUploadError]);

  const handleDownloadTemplate = useCallback(async () => {
    try {
      await downloadTemplate(selectedType.toLowerCase());
    } catch (error) {
      console.error('Error al descargar plantilla:', error);
    }
  }, [selectedType, downloadTemplate]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    reset();
  }, [reset]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        {/* Título */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargar Archivo Excel</h2>
          <p className="text-gray-600">Selecciona el tipo de datos y sube tu archivo Excel</p>
        </div>

        {/* Selector de tipo */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de datos
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TipoArchivo)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {TIPOS_ARCHIVO.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label} - {tipo.description}
              </option>
            ))}
          </select>
        </div>

        {/* Botón para descargar plantilla */}
        <div className="flex justify-center">
          <button
            onClick={handleDownloadTemplate}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Descargar Plantilla
          </button>
        </div>

        {/* Área de drop */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  {selectedFile ? selectedFile.name : 'Arrastra tu archivo aquí o '}
                </span>
                <span className="text-blue-600 hover:text-blue-500">haz clic para seleccionar</span>
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Solo archivos Excel (.xlsx, .xls)
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subiendo archivo...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {success && uploadResult && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                ¡Archivo subido exitosamente!
              </p>
              <p className="text-sm text-green-700">
                {uploadResult.message}
              </p>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Error al subir archivo
              </p>
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          {success ? (
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Subir Otro Archivo
            </button>
          ) : (
            <>
              <button
                onClick={handleReset}
                disabled={isUploading}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploading ? 'Subiendo...' : 'Subir Archivo'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { FileUploadComponent as FileUpload };