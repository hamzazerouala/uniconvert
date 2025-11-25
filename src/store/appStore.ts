import { create } from 'zustand';

// Types pour l'état de l'application
interface FileMetadata {
  name: string;
  type: string;
  size: number;
  extension: string;
}

interface ConversionResult {
  convertedFileId: string;
  originalFormat: string;
  targetFormat: string;
  downloadUrl: string;
  size: {
    original: number;
    converted: number;
  };
}

interface AppState {
  // État de l'upload
  uploadedFile: FileMetadata | null;
  fileId: string | null;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;

  // État de la conversion
  availableFormats: string[];
  isConverting: boolean;
  conversionResult: ConversionResult | null;
  conversionError: string | null;

  // Actions
  setUploadedFile: (file: FileMetadata, fileId: string) => void;
  setUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setUploadError: (error: string | null) => void;
  setAvailableFormats: (formats: string[]) => void;
  setConverting: (isConverting: boolean) => void;
  setConversionResult: (result: ConversionResult | null) => void;
  setConversionError: (error: string | null) => void;
  resetState: () => void;
}

const useAppStore = create<AppState>((set) => ({
  // État initial
  uploadedFile: null,
  fileId: null,
  isUploading: false,
  uploadProgress: 0,
  uploadError: null,
  availableFormats: [],
  isConverting: false,
  conversionResult: null,
  conversionError: null,

  // Actions
  setUploadedFile: (file, fileId) => set({ uploadedFile: file, fileId }),
  setUploading: (isUploading) => set({ isUploading }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setUploadError: (error) => set({ uploadError: error }),
  setAvailableFormats: (formats) => set({ availableFormats: formats }),
  setConverting: (isConverting) => set({ isConverting }),
  setConversionResult: (result) => set({ conversionResult: result }),
  setConversionError: (error) => set({ conversionError: error }),
  resetState: () => set({
    uploadedFile: null,
    fileId: null,
    isUploading: false,
    uploadProgress: 0,
    uploadError: null,
    availableFormats: [],
    isConverting: false,
    conversionResult: null,
    conversionError: null,
  }),
}));

export default useAppStore;