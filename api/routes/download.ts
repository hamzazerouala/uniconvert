import express from 'express';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

// Route pour télécharger un fichier converti
router.get('/api/download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(process.cwd(), 'temp', fileId);
    
    // Vérification de l'existence du fichier
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    // Lecture du fichier et détermination du type MIME
    const buffer = await fs.readFile(filePath);
    const ext = path.extname(fileId).toLowerCase();
    
    // Mapping des extensions vers les types MIME
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.tiff': 'image/tiff',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Détermination du nom de fichier pour le téléchargement
    const originalName = req.query.name as string || 'converted-file';
    const downloadName = `${path.basename(originalName, path.extname(originalName))}${ext}`;

    // Configuration des headers pour le téléchargement
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.setHeader('Content-Length', buffer.length);
    
    // Envoi du fichier
    res.send(buffer);

    // Nettoyage optionnel après téléchargement (décommenter si nécessaire)
    // await fs.unlink(filePath);

  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    res.status(500).json({ 
      error: 'Erreur lors du téléchargement du fichier',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

// Route pour supprimer un fichier temporaire (pour le nettoyage)
router.delete('/api/cleanup/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(process.cwd(), 'temp', fileId);
    
    // Vérification de l'existence du fichier
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    // Suppression du fichier
    await fs.unlink(filePath);
    
    res.json({ success: true, message: 'Fichier supprimé avec succès' });

  } catch (error) {
    console.error('Erreur lors du nettoyage:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du fichier',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

export default router;