import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  uploadProgress?: number;
}

export default function FileUpload({ onFileUpload, isUploading, uploadProgress }: FileUploadProps) {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  }, [onFileUpload]);

  

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('upload.drop')}</h3>
            <p className="text-gray-600 mb-4">
              {t('upload.browse')}
            </p>
          </div>

          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
            accept=".docx,.pdf,.txt,.rtf,.odt,.xlsx,.pptx,.jpg,.jpeg,.png,.webp,.tiff,.svg,.heic,.mp3,.wav,.flac,.aac,.ogg,.mp4,.mov,.avi,.mkv,.webm"
            disabled={isUploading}
          />
          
          <label
            htmlFor="file-input"
            className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            {t('upload.chooseFile')}
          </label>

          {isUploading && (
            <div className="w-full max-w-xs">
              <div className="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress || 0}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {t('upload.progress', { percent: uploadProgress || 0 })}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>{t('upload.supported')}</p>
          <p>{t('upload.maxSize')}</p>
        </div>
      </div>
    </div>
  );
}
