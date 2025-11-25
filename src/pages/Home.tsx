import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import ConversionOptions from '../components/ConversionOptions';
import useAppStore from '../store/appStore';
import useAuthStore from '../store/authStore';
import { uploadFile, getAvailableFormats, convertFile, downloadFile } from '../utils/api';

type ConvertOptions = { video?: { crf:number; bitrate:string; preset:string }, pdf?: { pageNumber?: number; pageRange?: string; scale: number } }
import { CheckCircle, AlertCircle, Download, RefreshCw, Lock } from 'lucide-react';

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, subscription, canConvert, incrementConversions, token } = useAuthStore();
  const {
    uploadedFile,
    fileId,
    isUploading,
    uploadProgress,
    uploadError,
    availableFormats,
    isConverting,
    conversionResult,
    conversionError,
    setUploadedFile,
    setUploading,
    setUploadProgress,
    setUploadError,
    setAvailableFormats,
    setConverting,
    setConversionResult,
    setConversionError,
    resetState,
  } = useAppStore();

  const [showConversion, setShowConversion] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Gestion de l'upload
  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setUploadError(null);
      setUploading(true);
      setUploadProgress(0);

      // Simulation de la progression (à améliorer avec un vrai système de progression)
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        if (currentProgress >= 90) {
          clearInterval(progressInterval);
          currentProgress = 90;
        }
        setUploadProgress(currentProgress);
      }, 200);

      const result = await uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success) {
        setUploadedFile(result.metadata, result.fileId);
        setShowConversion(true);
        
        // Récupération des formats disponibles
        try {
          const formatsResult = await getAvailableFormats(result.fileId);
          setAvailableFormats(formatsResult.availableFormats);
        } catch (error) {
          console.error(t('errors.fetchFormats'), error);
        }
      }
    } catch (error) {
      console.error(t('errors.upload'), error);
      setUploadError(error instanceof Error ? error.message : t('errors.upload'));
    } finally {
      setUploading(false);
    }
  }, [t, setUploadedFile, setUploading, setUploadProgress, setUploadError, setAvailableFormats]);

  // Gestion de la conversion
  const handleConvert = useCallback(async (targetFormat: string, options?: ConvertOptions) => {
    if (!fileId) return;

    // Vérifier les limites de conversion
    if (!canConvert()) {
      setShowLimitModal(true);
      return;
    }

    try {
      setConversionError(null);
      setConverting(true);

      const result = await convertFile(fileId, targetFormat, options, token || undefined);
      setConversionResult(result);
      
      // Incrémenter le compteur de conversions
      incrementConversions();
    } catch (error) {
      console.error(t('errors.convert'), error);
      setConversionError(error instanceof Error ? error.message : t('errors.convert'));
    } finally {
      setConverting(false);
    }
  }, [t, token, fileId, canConvert, incrementConversions, setConversionError, setConverting, setConversionResult]);

  // Gestion du téléchargement
  const handleDownload = useCallback(() => {
    if (conversionResult) {
      const originalName = uploadedFile?.name || t('download.defaultName');
      const baseName = originalName.split('.').slice(0, -1).join('.');
      const downloadName = `${baseName}${conversionResult.targetFormat}`;
      downloadFile(conversionResult.convertedFileId, downloadName);
    }
  }, [t, conversionResult, uploadedFile]);

  // Réinitialisation
  const handleReset = useCallback(() => {
    resetState();
    setShowConversion(false);
  }, [resetState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
            </div>
            <div className="flex items-center space-x-4">
              {subscription.plan === 'free' && (
                <div className="text-sm text-gray-600">
                  {t('header.remaining', { count: Math.max(0, subscription.maxConversions - subscription.conversionsUsed) })}
                </div>
              )}
              <button 
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                {t('header.pricing')}
              </button>
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {['fr','en','es','de','zh','ja','ru','ar','fa','pt','hi'].map(l => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
              <button 
                onClick={() => navigate(user ? '/account' : '/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {user ? t('header.account') : t('header.login')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('hero.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

        {/* Upload Section */}
        {!showConversion && !conversionResult && (
          <div className="mb-8">
            {uploadError && (
              <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{uploadError}</span>
            </div>
          )}
          <FileUpload 
            onFileUpload={handleFileUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </div>
      )}

        {/* Conversion Section */}
        {showConversion && !conversionResult && (
          <div className="mb-8">
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700">{t('upload.success', { name: uploadFile?.name })}</span>
              </div>
            </div>
            <ConversionOptions
              fileId={fileId!}
              originalFormat={uploadedFile!.extension}
              availableFormats={availableFormats}
              onConvert={handleConvert}
              isConverting={isConverting}
            />
            {conversionError && (
              <div className="max-w-md mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{conversionError}</p>
              </div>
            )}

            {/* Modal de limitation */}
            {showLimitModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Lock className="w-6 h-6 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{t('limit.title')}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {t('limit.text', { limit: subscription.maxConversions })}
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate('/pricing')}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t('limit.viewPricing')}
                    </button>
                    <button
                      onClick={() => setShowLimitModal(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {t('limit.cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result Section */}
        {conversionResult && (
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('convert.successTitle')}</h3>
                <p className="text-gray-600 mb-6">
                  {t('convert.successText', { from: conversionResult.originalFormat, to: conversionResult.targetFormat })}
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">{t('convert.sizeOriginal')}</span>
                      <br />
                      <span className="font-medium">
                        {Math.round(conversionResult.size.original / 1024)} {t('units.kb')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">{t('convert.sizeConverted')}</span>
                      <br />
                      <span className="font-medium">
                        {Math.round(conversionResult.size.converted / 1024)} {t('units.kb')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {t('convert.download')}
                  </button>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    {t('convert.another')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.fastTitle')}</h3>
            <p className="text-gray-600">{t('features.fastDesc')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.secureTitle')}</h3>
            <p className="text-gray-600">{t('features.secureDesc')}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('features.universalTitle')}</h3>
            <p className="text-gray-600">{t('features.universalDesc')}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
