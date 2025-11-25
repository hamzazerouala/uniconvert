import { useState } from 'react';
import { ChevronDown, FileText, Image, Music, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type VideoQuality = 'low'|'medium'|'high'

interface ConversionOptionsProps {
  fileId: string;
  originalFormat: string;
  availableFormats: string[];
  onConvert: (targetFormat: string, options?: { video?: { crf:number; bitrate:string; preset:string }, pdf?: { pageNumber?: number; pageRange?: string; scale: number } }) => void;
  isConverting: boolean;
}

export default function ConversionOptions({ 
  originalFormat, 
  availableFormats, 
  onConvert, 
  isConverting 
}: ConversionOptionsProps) {
  const { t } = useTranslation();
  const [selectedFormat, setSelectedFormat] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [qualityPreset, setQualityPreset] = useState<VideoQuality>('medium');
  const isVideo = ['.mp4','.webm','.mov','.avi','.mkv'].includes(originalFormat.toLowerCase()) || ['.mp4','.webm'].includes(selectedFormat.toLowerCase());
  const isPdfToImage = originalFormat.toLowerCase() === '.pdf' && ['.png','.jpg','.zip'].includes(selectedFormat.toLowerCase());
  const [pdfPageNumber, setPdfPageNumber] = useState(1);
  const [pdfScale, setPdfScale] = useState(2);
  const [pdfPageRange, setPdfPageRange] = useState('');

  const getFileIcon = (extension: string) => {
    const ext = extension.toLowerCase();
    if (['.pdf', '.docx', '.txt', '.rtf', '.odt', '.xlsx', '.pptx'].includes(ext)) {
      return <FileText className="w-4 h-4" />;
    }
    if (['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.svg'].includes(ext)) {
      return <Image className="w-4 h-4" />;
    }
    if (['.mp3', '.wav', '.flac', '.aac', '.ogg'].includes(ext)) {
      return <Music className="w-4 h-4" />;
    }
    if (['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext)) {
      return <Video className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const getFormatCategory = (extension: string) => {
    const ext = extension.toLowerCase();
    if (['.pdf', '.docx', '.txt', '.rtf', '.odt', '.xlsx', '.pptx'].includes(ext)) return t('category.document');
    if (['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.svg'].includes(ext)) return t('category.image');
    if (['.mp3', '.wav', '.flac', '.aac', '.ogg'].includes(ext)) return t('category.audio');
    if (['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext)) return t('category.video');
    return t('category.file');
  };

  const handleConvert = () => {
    if (selectedFormat && !isConverting) {
      let options: { video?: { crf:number; bitrate:string; preset:string }, pdf?: { pageNumber?: number; pageRange?: string; scale: number } } | undefined = undefined;
      if (isVideo) {
        const map: Record<string,{crf:number,bitrate:string,preset:string}> = {
          low: { crf: 36, bitrate: '1200k', preset: 'veryfast' },
          medium: { crf: 28, bitrate: '2500k', preset: 'veryfast' },
          high: { crf: 22, bitrate: '5000k', preset: 'faster' },
        };
        options = { video: map[qualityPreset] };
      } else if (isPdfToImage) {
        if (selectedFormat === '.zip') {
          options = { pdf: { pageRange: pdfPageRange || undefined, scale: pdfScale } };
        } else {
          options = { pdf: { pageNumber: pdfPageNumber, scale: pdfScale } };
        }
      }
      onConvert(selectedFormat, options);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('convert.title')}
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {getFileIcon(originalFormat)}
          <span>{t('convert.currentFormatLabel')} <span className="font-medium">{originalFormat.toUpperCase()}</span></span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('convert.chooseFormat')}
        </label>
        <div className="relative">
          <button
            type="button"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isConverting}
          >
            <div className="flex items-center space-x-2">
              {selectedFormat ? (
                <>
                  {getFileIcon(selectedFormat)}
                  <span>{selectedFormat.toUpperCase()} ({getFormatCategory(selectedFormat)})</span>
                </>
              ) : (
                <span className="text-gray-500">{t('convert.selectFormat')}</span>
              )}
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {availableFormats.map((format) => (
                <button
                  key={format}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                  onClick={() => {
                    setSelectedFormat(format);
                    setIsDropdownOpen(false);
                  }}
                >
                  {getFileIcon(format)}
                  <div>
                    <div className="font-medium">{format.toUpperCase()}</div>
                    <div className="text-sm text-gray-500">{getFormatCategory(format)}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isVideo && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('video.quality')}</label>
          <select
            value={qualityPreset}
            onChange={(e) => setQualityPreset(e.target.value as VideoQuality)}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2"
            disabled={isConverting}
          >
            <option value="low">{t('video.low')}</option>
            <option value="medium">{t('video.medium')}</option>
            <option value="high">{t('video.high')}</option>
          </select>
        </div>
      )}

      {isPdfToImage && selectedFormat !== '.zip' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('pdf.page')}</label>
            <input type="number" min={1} value={pdfPageNumber} onChange={(e)=>setPdfPageNumber(parseInt(e.target.value)||1)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('pdf.scale')}</label>
            <input type="number" step={0.1} min={0.5} max={4} value={pdfScale} onChange={(e)=>setPdfScale(parseFloat(e.target.value)||2)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>
      )}

      {isPdfToImage && selectedFormat === '.zip' && (
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('pdf.pageRange')} {t('pdf.exampleRange')}</label>
            <input type="text" value={pdfPageRange} onChange={(e)=>setPdfPageRange(e.target.value)} placeholder={t('pdf.placeholderAll')} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('pdf.scale')}</label>
            <input type="number" step={0.1} min={0.5} max={4} value={pdfScale} onChange={(e)=>setPdfScale(parseFloat(e.target.value)||2)} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2" />
          </div>
        </div>
      )}

      <button
        type="button"
        className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        onClick={handleConvert}
        disabled={!selectedFormat || isConverting}
      >
        {isConverting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{t('convert.converting')}</span>
          </div>
        ) : (
          t('convert.button')
        )}
      </button>
    </div>
  );
}
