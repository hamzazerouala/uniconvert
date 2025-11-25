import express from 'express';
import multer, { File as MulterFile } from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import mime from 'mime-types';
import path from 'path';
import fs from 'fs/promises';

// Déclaration d'extension pour multer
declare module 'express-serve-static-core' {
  interface Request {
    file?: MulterFile
  }
}

const router = express.Router();

// Configuration Multer pour stocker en mémoire
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (req, file, cb) => {
    // Validation basique de l'extension
    const allowedExtensions = [
      '.docx', '.pdf', '.txt', '.rtf', '.odt', '.xlsx', '.pptx',
      '.jpg', '.jpeg', '.png', '.webp', '.tiff', '.svg', '.heic', '.gif',
      '.mp3', '.wav', '.flac', '.aac', '.ogg',
      '.mp4', '.mov', '.avi', '.mkv', '.webm'
    ];
    
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté'));
    }
  }
});

// Interface pour les métadonnées du fichier
interface FileMetadata {
  originalName: string;
  mimeType: string;
  detectedMimeType: string;
  size: number;
  extension: string;
  uploadTimestamp: Date;
  fileId: string;
}

// Route d'upload principale
router.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const { buffer, originalname, size } = req.file;
    
    // Détection du type MIME via file-type (plus fiable que l'extension)
    const fileType = await fileTypeFromBuffer(buffer);
    const detectedMimeType = fileType ? fileType.mime : 'application/octet-stream';
    
    // Type MIME basé sur l'extension (pour comparaison)
    const extensionMimeType = mime.lookup(originalname) || 'application/octet-stream';
    
    // Validation de cohérence
    if (detectedMimeType !== extensionMimeType && detectedMimeType !== 'application/octet-stream') {
      console.warn(`Incohérence MIME détectée: extension=${extensionMimeType}, détecté=${detectedMimeType}`);
    }

    // Génération d'un ID unique pour le fichier
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Création du dossier temporaire s'il n'existe pas
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    // Sauvegarde du fichier temporaire
    const filePath = path.join(tempDir, fileId);
    await fs.writeFile(filePath, buffer);

    // Métadonnées du fichier
    const metadata: FileMetadata = {
      originalName: originalname,
      mimeType: detectedMimeType,
      detectedMimeType,
      size,
      extension: path.extname(originalname).toLowerCase(),
      uploadTimestamp: new Date(),
      fileId
    };

    // Simulation du tracking utilisateur (à remplacer par une vraie base de données)
    const userId = req.headers['x-user-id'] || 'anonymous';
    console.log(`Fichier uploadé par ${userId}:`, metadata);

    res.json({
      success: true,
      fileId,
      metadata: {
        name: originalname,
        type: detectedMimeType,
        size: size,
        extension: path.extname(originalname).toLowerCase()
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    res.status(500).json({ 
      error: 'Erreur lors du traitement du fichier',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Route pour obtenir les informations d'un fichier
router.get('/api/file/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(process.cwd(), 'temp', fileId);
    
    // Vérification de l'existence du fichier
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    // Lecture du fichier pour obtenir les métadonnées
    const buffer = await fs.readFile(filePath);
    const fileType = await fileTypeFromBuffer(buffer);
    const stats = await fs.stat(filePath);

    res.json({
      fileId,
      metadata: {
        size: stats.size,
        type: fileType?.mime || 'application/octet-stream',
        uploadedAt: stats.birthtime
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du fichier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
export {}
