const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Fonction pour uploader un fichier
export const uploadFile = async (file: File): Promise<{
  success: boolean;
  fileId: string;
  metadata: {
    name: string;
    type: string;
    size: number;
    extension: string;
  };
}> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de l\'upload');
  }

  return response.json();
};

// Fonction pour obtenir les formats disponibles
export const getAvailableFormats = async (fileId: string): Promise<{
  fileId: string;
  originalFormat: string;
  availableFormats: string[];
}> => {
  const response = await fetch(`${API_BASE_URL}/api/formats/${fileId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la récupération des formats');
  }

  return response.json();
};

export const getCapabilities = async (): Promise<{ pdfImage: boolean; pdfZipImages: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/api/capabilities`);
  if (!response.ok) {
    return { pdfImage: false, pdfZipImages: false };
  }
  return response.json();
};

// Fonction pour convertir un fichier
export type ConvertOptions = { video?: { crf:number; bitrate:string; preset:string }, pdf?: { pageNumber?: number; pageRange?: string; scale: number } }

export const convertFile = async (fileId: string, targetFormat: string, options?: ConvertOptions, token?: string): Promise<{
  success: boolean;
  convertedFileId: string;
  originalFormat: string;
  targetFormat: string;
  downloadUrl: string;
  size: {
    original: number;
    converted: number;
  };
}> => {
  const response = await fetch(`${API_BASE_URL}/api/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      fileId,
      targetFormat,
      options,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la conversion');
  }

  return response.json();
};

export const authRegister = async (email: string, password: string, name?: string): Promise<{
  success: boolean;
  token: string;
  user: { id: string; email: string; name?: string };
  subscription: { plan: string; status: string; conversionsUsed: number; maxConversions: number };
}> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur d\'inscription');
  }
  return response.json();
};

export const authLogin = async (email: string, password: string): Promise<{
  success: boolean;
  token: string;
  user: { id: string; email: string; name?: string };
  subscription: { plan: string; status: string; conversionsUsed: number; maxConversions: number };
}> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur de connexion');
  }
  return response.json();
};

// Fonction pour télécharger un fichier
export const downloadFile = (fileId: string, fileName: string): void => {
  const downloadUrl = `${API_BASE_URL}/api/download/${fileId}?name=${encodeURIComponent(fileName)}`;
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Fonction pour formater la taille d'un fichier
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Fonction pour obtenir l'icône selon le type de fichier
export const getFileIcon = (extension: string): string => {
  const ext = extension.toLowerCase();
  if (['.pdf', '.docx', '.txt', '.rtf', '.odt', '.xlsx', '.pptx'].includes(ext)) return '📄';
  if (['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.svg'].includes(ext)) return '🖼️';
  if (['.mp3', '.wav', '.flac', '.aac', '.ogg'].includes(ext)) return '🎵';
  if (['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext)) return '🎬';
  if (['.zip', '.rar', '.7z'].includes(ext)) return '📦';
  return '📎';
};
