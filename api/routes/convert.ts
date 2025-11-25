import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { maybeAuthenticate } from '../middleware/auth.js';
import type { AuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();
const isLikelyText = (buf: Buffer): boolean => {
  const len = Math.min(buf.length, 2048);
  if (len === 0) return false;
  let printable = 0;
  for (let i = 0; i < len; i++) {
    const c = buf[i];
    if (c === 9 || c === 10 || c === 13 || (c >= 32 && c <= 126)) printable++;
  }
  return printable / len > 0.9;
};
const conversionCounts = new Map<string, { count: number; resetAt: number }>();
const FREE_LIMIT = 1;
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath as string);
}

// Configuration des formats supportés pour chaque type de fichier
const SUPPORTED_CONVERSIONS = {
  // Images
  '.jpg': ['.png', '.webp', '.tiff', '.pdf', '.avif', '.gif'],
  '.jpeg': ['.png', '.webp', '.tiff', '.pdf', '.avif', '.gif'],
  '.png': ['.jpg', '.webp', '.tiff', '.pdf', '.avif', '.gif'],
  '.webp': ['.jpg', '.png', '.tiff', '.pdf', '.avif', '.gif'],
  '.tiff': ['.jpg', '.png', '.webp', '.pdf', '.avif', '.gif'],
  '.svg': ['.png', '.jpg', '.webp', '.pdf', '.avif', '.gif'],
  '.heic': ['.jpg', '.png', '.webp'],
  '.gif': ['.png', '.jpg', '.webp'],

  // Documents
  '.txt': ['.pdf'],
  '.rtf': ['.pdf'],
  '.docx': ['.txt', '.html', '.pdf'],
  '.xlsx': ['.csv'],
  '.pptx': ['.pdf', '.txt'],
  '.pdf': ['.txt', '.png', '.jpg', '.zip'],

  // Audio
  '.wav': ['.mp3'],

  // Vidéo (placeholder - nécessitera FFmpeg dans une version future)
  '.mp4': ['.webm', '.mp3'],
  '.webm': ['.mp4'],
  '.mov': ['.mp4', '.webm'],
  '.avi': ['.mp4', '.webm'],
  '.mkv': ['.mp4', '.webm']
};

// Types minimaux pour PDF.js
type PdfJsTextItem = { str?: string }
type PdfPageViewport = { width: number; height: number }
type PdfPage = {
  getViewport: (opts: { scale: number }) => PdfPageViewport;
  render: (ctx: { canvasContext: unknown; viewport: PdfPageViewport }) => { promise: Promise<void> };
  getTextContent: () => Promise<{ items: PdfJsTextItem[] }>;
}
type PdfDoc = { numPages: number; getPage: (page: number) => Promise<PdfPage> }
type PdfJsModule = { getDocument: (params: { data: Uint8Array | Buffer }) => { promise: Promise<PdfDoc> } }

// Route pour obtenir les formats de conversion disponibles
router.get('/api/formats/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(process.cwd(), 'temp', fileId);
    
    // Vérification de l'existence du fichier
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    // Lecture du fichier pour déterminer son extension
    const files = await fs.readdir(path.join(process.cwd(), 'temp'));
    const originalFile = files.find(f => f === fileId);
    
    if (!originalFile) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    // Pour déterminer l'extension originale, nous utilisons le type MIME détecté
    const buffer = await fs.readFile(filePath);
    const fileType = await import('file-type');
    const detectedType = await fileType.fileTypeFromBuffer(buffer);
    
    // Mapping des types MIME vers les extensions
    const mimeToExt: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/tiff': '.tiff',
      'image/gif': '.gif',
      'image/heic': '.heic',
      'image/svg+xml': '.svg',
      'text/plain': '.txt',
      'text/rtf': '.rtf',
      'application/pdf': '.pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      'audio/wav': '.wav',
      'audio/mpeg': '.mp3',
      'video/mp4': '.mp4',
      'video/webm': '.webm'
      , 'video/quicktime': '.mov'
      , 'video/x-msvideo': '.avi'
      , 'video/x-matroska': '.mkv'
    };
    
    let extension = '.unknown';
    if (detectedType && detectedType.mime) {
      extension = mimeToExt[detectedType.mime] || `.${detectedType.ext || 'unknown'}`;
    } else {
      const content = buffer.toString('utf8', 0, 100);
      if (content.includes('<svg')) {
        extension = '.svg';
      } else if (content.includes('%PDF-')) {
        extension = '.pdf';
      } else if (isLikelyText(buffer)) {
        extension = '.txt';
      }
    }
    
    console.log(`Extension détectée: ${extension}, Type MIME: ${detectedType?.mime || 'inconnu'}`);
    
    let availableFormats = SUPPORTED_CONVERSIONS[extension as keyof typeof SUPPORTED_CONVERSIONS] || [];
    if (extension === '.pdf') {
      let pdfImageSupported = false;
      try {
        const nodeModule = await import('module');
        const require = nodeModule.createRequire(import.meta.url);
        require('pdfjs-dist/legacy/build/pdf.js');
        require('@napi-rs/canvas');
        pdfImageSupported = true;
      } catch {
        pdfImageSupported = false;
      }
      if (!pdfImageSupported) {
        availableFormats = availableFormats.filter((f) => f !== '.png' && f !== '.zip');
      }
    }

    res.json({
      fileId,
      originalFormat: extension,
      availableFormats,
      allFormats: Object.keys(SUPPORTED_CONVERSIONS)
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des formats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour convertir un fichier
router.post('/api/convert', maybeAuthenticate, async (req: Request & { user?: AuthenticatedUser }, res: Response) => {
  try {
    const { fileId, targetFormat, options = {} } = req.body;
    
    if (!fileId || !targetFormat) {
      return res.status(400).json({ error: 'fileId et targetFormat sont requis' });
    }

    const filePath = path.join(process.cwd(), 'temp', fileId);
    
    // Vérification de l'existence du fichier
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    const user = req.user;
    const userKey = user?.id || (req.ip || 'anonymous');
    let record = conversionCounts.get(userKey);
    const now = Date.now();
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 };
      conversionCounts.set(userKey, record);
    }
    if (user && user.plan === 'free' && record.count >= (user.maxConversions ?? FREE_LIMIT)) {
      return res.status(403).json({
        error: 'Limite de conversions atteinte',
        message: 'Passez à un plan Pro pour des conversions illimitées',
        upgradeUrl: '/pricing'
      });
    }

    // Lecture du fichier original
    const buffer = await fs.readFile(filePath);
    
    // Détection du type et extension comme dans la route /formats
    const fileType = await import('file-type');
    const detectedType = await fileType.fileTypeFromBuffer(buffer);
    
    const mimeToExt: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/tiff': '.tiff',
      'image/gif': '.gif',
      'image/heic': '.heic',
      'image/svg+xml': '.svg',
      'text/plain': '.txt',
      'text/rtf': '.rtf',
      'application/pdf': '.pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      'audio/wav': '.wav',
      'audio/mpeg': '.mp3',
      'video/mp4': '.mp4',
      'video/webm': '.webm'
      , 'video/quicktime': '.mov'
      , 'video/x-msvideo': '.avi'
      , 'video/x-matroska': '.mkv'
    };
    
    let originalExtension = '.unknown';
    if (detectedType && detectedType.mime) {
      originalExtension = mimeToExt[detectedType.mime] || `.${detectedType.ext || 'unknown'}`;
    } else {
      const content = buffer.toString('utf8', 0, 100);
      if (content.includes('<svg')) {
        originalExtension = '.svg';
      } else if (content.includes('%PDF-')) {
        originalExtension = '.pdf';
      } else if (isLikelyText(buffer)) {
        originalExtension = '.txt';
      }
    }
    
    // Validation du format cible
    const availableFormats = SUPPORTED_CONVERSIONS[originalExtension as keyof typeof SUPPORTED_CONVERSIONS] || [];
    if (!availableFormats.includes(targetFormat)) {
      return res.status(400).json({ 
        error: `Conversion non supportée de ${originalExtension} vers ${targetFormat}`,
        availableFormats 
      });
    }

    let convertedBuffer: Buffer;
    
    // Logique de conversion selon le type de fichier
    if (['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.svg', '.heic', '.gif'].includes(originalExtension)) {
      // Conversion d'image avec Sharp
      let imageProcessor = sharp(buffer);
      
      // Application des options de qualité/dimensions si fournies
      if (options.width || options.height) {
        imageProcessor = imageProcessor.resize(options.width, options.height);
      }
      
      switch (targetFormat) {
        case '.jpg':
        case '.jpeg':
          convertedBuffer = await imageProcessor
            .jpeg({ quality: options.quality || 80 })
            .toBuffer();
          break;
        case '.png':
          convertedBuffer = await imageProcessor
            .png({ quality: options.quality || 80 })
            .toBuffer();
          break;
        case '.webp':
          convertedBuffer = await imageProcessor
            .webp({ quality: options.quality || 80 })
            .toBuffer();
          break;
        case '.avif':
          convertedBuffer = await imageProcessor
            .avif({ quality: options.quality || 50 })
            .toBuffer();
          break;
        case '.gif':
          convertedBuffer = await imageProcessor
            .gif()
            .toBuffer();
          break;
        case '.tiff':
          convertedBuffer = await imageProcessor
            .tiff({ quality: options.quality || 80 })
            .toBuffer();
          break;
        case '.pdf': {
          const meta = await imageProcessor.metadata();
          const imgBuf = await imageProcessor.png().toBuffer();
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage([meta.width || 800, meta.height || 600]);
          const pngImage = await pdfDoc.embedPng(imgBuf);
          const { width, height } = page.getSize();
          page.drawImage(pngImage, { x: 0, y: 0, width, height });
          convertedBuffer = Buffer.from(await pdfDoc.save());
          break;
        }
        default:
          throw new Error(`Format cible non supporté: ${targetFormat}`);
      }
    } else if (originalExtension === '.txt' && targetFormat === '.pdf') {
      const textContent = buffer.toString('utf8');
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const { width, height } = page.getSize();
      const margin = 50;
      const maxWidth = width - margin * 2;
      const lineHeight = fontSize * 1.4;
      const words = textContent.split(/\s+/);
      const lines: string[] = [];
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      let y = height - margin;
      for (const line of lines) {
        if (y < margin) {
          const newPage = pdfDoc.addPage();
          y = newPage.getSize().height - margin;
        }
        page.drawText(line, { x: margin, y: y - fontSize, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }
      convertedBuffer = Buffer.from(await pdfDoc.save());
    } else if (originalExtension === '.rtf' && targetFormat === '.pdf') {
      const rtf = buffer.toString('utf8');
      const text = rtf
        .replace(/\{\\\*?[^}]*\}/g, '')
        .replace(/[{}]/g, '')
        .replace(/\\'([0-9a-fA-F]{2})/g, (_m, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/\\[^\s]+\s?/g, '')
        .trim();
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const { width, height } = page.getSize();
      const margin = 50;
      const maxWidth = width - margin * 2;
      const lineHeight = fontSize * 1.4;
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      let y = height - margin;
      for (const line of lines) {
        if (y < margin) {
          const newPage = pdfDoc.addPage();
          y = newPage.getSize().height - margin;
        }
        page.drawText(line, { x: margin, y: y - fontSize, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }
      convertedBuffer = Buffer.from(await pdfDoc.save());
    } else if (['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(originalExtension)) {
      const inputName = `${fileId}-src${originalExtension}`;
      const outputName = `${fileId}-ffmpeg-${Date.now()}${targetFormat}`;
      const tempDir = path.join(process.cwd(), 'temp');
      const inputPath = path.join(tempDir, inputName);
      const outputPath = path.join(tempDir, outputName);
      await fs.writeFile(inputPath, buffer);
      await new Promise<void>((resolve, reject) => {
        let proc = ffmpeg(inputPath);
        if (originalExtension === '.mp4' && targetFormat === '.webm') {
          proc = proc.outputOptions(['-c:v libvpx-vp9', '-b:v 0', '-crf 32']);
        } else if (originalExtension === '.webm' && targetFormat === '.mp4') {
          proc = proc.outputOptions(['-c:v libx264', '-preset veryfast', '-crf 23']);
        }
        proc.output(outputPath).on('end', resolve).on('error', reject).run();
      });
      convertedBuffer = await fs.readFile(outputPath);
      await fs.unlink(inputPath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
    } else if (originalExtension === '.mp3' && targetFormat === '.wav') {
      const inputName = `${fileId}-src${originalExtension}`;
      const outputName = `${fileId}-ffmpeg-${Date.now()}${targetFormat}`;
      const tempDir = path.join(process.cwd(), 'temp');
      const inputPath = path.join(tempDir, inputName);
      const outputPath = path.join(tempDir, outputName);
      await fs.writeFile(inputPath, buffer);
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions(['-ar 44100', '-ac 2'])
          .output(outputPath)
          .on('end', resolve)
          .on('error', reject)
          .run();
      });
      convertedBuffer = await fs.readFile(outputPath);
      await fs.unlink(inputPath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
    } else if (originalExtension === '.docx' && targetFormat === '.txt') {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      convertedBuffer = Buffer.from(result.value || '');
    } else if (originalExtension === '.docx' && targetFormat === '.pdf') {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      const textContent = result.value || '';
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const { width, height } = page.getSize();
      const margin = 50;
      const maxWidth = width - margin * 2;
      const lineHeight = fontSize * 1.4;
      const words = textContent.split(/\s+/);
      const lines: string[] = [];
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      let y = height - margin;
      for (const line of lines) {
        if (y < margin) {
          const newPage = pdfDoc.addPage();
          y = newPage.getSize().height - margin;
        }
        page.drawText(line, { x: margin, y: y - fontSize, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }
      convertedBuffer = Buffer.from(await pdfDoc.save());
    } else if (originalExtension === '.xlsx' && targetFormat === '.csv') {
      const XLSX = await import('xlsx');
      const wb = XLSX.read(buffer, { type: 'buffer' });
      const firstSheetName = wb.SheetNames[0];
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[firstSheetName]);
      convertedBuffer = Buffer.from(csv);
    } else if (originalExtension === '.xlsx' && targetFormat === '.json') {
      const XLSX = await import('xlsx');
      const wb = XLSX.read(buffer, { type: 'buffer' });
      const firstSheetName = wb.SheetNames[0];
      const json = XLSX.utils.sheet_to_json(wb.Sheets[firstSheetName], { defval: '' });
      convertedBuffer = Buffer.from(JSON.stringify(json, null, 2));
    } else if (originalExtension === '.docx' && targetFormat === '.html') {
      const mammoth = await import('mammoth');
      const result = await mammoth.convertToHtml({ buffer });
      convertedBuffer = Buffer.from(result.value || '');
    } else if (originalExtension === '.pptx' && targetFormat === '.txt') {
      const zip = await JSZip.loadAsync(buffer);
      const allText: string[] = [];
      const slideFiles = Object.keys(zip.files).filter((f) => f.startsWith('ppt/slides/slide') && f.endsWith('.xml'));
      for (const f of slideFiles) {
        const xml = await zip.files[f].async('string');
        const matches = xml.match(/<a:t>([\s\S]*?)<\/a:t>/g) || [];
        const texts = matches.map(m => m.replace(/<\/?a:t>/g, ''));
        if (texts.length) {
          allText.push(`Slide ${f.replace(/[^0-9]/g,'')}:`);
          allText.push(...texts);
          allText.push('');
        }
      }
      convertedBuffer = Buffer.from(allText.join('\n'));
    } else if (originalExtension === '.pptx' && targetFormat === '.pdf') {
      const zip = await JSZip.loadAsync(buffer);
      const slideFiles = Object.keys(zip.files).filter((f) => f.startsWith('ppt/slides/slide') && f.endsWith('.xml'));
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 14;
      for (const f of slideFiles) {
        const page = pdfDoc.addPage([1024, 768]);
        const xml = await zip.files[f].async('string');
        const matches = xml.match(/<a:t>([\s\S]*?)<\/a:t>/g) || [];
        const texts = matches.map(m => m.replace(/<\/?a:t>/g, ''));
        let y = 720;
        const margin = 40;
        const maxWidth = 1024 - margin * 2;
        const lineHeight = fontSize * 1.4;
        const toLines = (t: string) => {
          const words = t.split(/\s+/);
          const lines: string[] = []; let cur = '';
          for (const w of words) {
            const test = cur ? cur + ' ' + w : w;
            if (font.widthOfTextAtSize(test, fontSize) > maxWidth) { lines.push(cur); cur = w; } else { cur = test; }
          }
          if (cur) lines.push(cur);
          return lines;
        };
        for (const t of texts) {
          const lines = toLines(t);
          for (const line of lines) {
            if (y < margin) { const np = pdfDoc.addPage([1024, 768]); y = np.getSize().height - margin; }
            page.drawText(line, { x: margin, y: y - fontSize, size: fontSize, font, color: rgb(0,0,0) });
            y -= lineHeight;
          }
          y -= lineHeight;
        }
      }
      convertedBuffer = Buffer.from(await pdfDoc.save());
    } else if (originalExtension === '.pdf' && (targetFormat === '.png' || targetFormat === '.jpg')) {
      try {
        const nodeModule = await import('module');
        const require = nodeModule.createRequire(import.meta.url);
        const pdfjs = require('pdfjs-dist/legacy/build/pdf.js') as unknown as PdfJsModule;
        const { createCanvas } = require('@napi-rs/canvas');
        const doc = await pdfjs.getDocument({ data: buffer }).promise;
        const pageNumber = options?.pdf?.pageNumber ? Math.max(1, Math.min(doc.numPages, Number(options.pdf.pageNumber))) : 1;
        const scale = options?.pdf?.scale ? Number(options.pdf.scale) : 2.0;
        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = createCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext('2d');
        const renderContext = { canvasContext: ctx, viewport };
        await page.render(renderContext).promise;
        convertedBuffer = canvas.toBuffer(targetFormat === '.jpg' ? 'image/jpeg' : 'image/png');
      } catch (e) {
        return res.status(501).json({
          error: 'Conversion PDF vers image indisponible sur cette plateforme',
          details: e instanceof Error ? e.message : 'Module canvas manquant'
        });
      }
    } else if (originalExtension === '.pdf' && targetFormat === '.zip') {
      try {
        const nodeModule = await import('module');
        const require = nodeModule.createRequire(import.meta.url);
        const pdfjs = require('pdfjs-dist/legacy/build/pdf.js') as unknown as PdfJsModule;
        const { createCanvas } = require('@napi-rs/canvas');
        const zip = new JSZip();
        const doc = await pdfjs.getDocument({ data: buffer }).promise;
        const scale = options?.pdf?.scale ? Number(options.pdf.scale) : 2.0;
        let pages: number[] = [];
        const range: string | undefined = options?.pdf?.pageRange;
        if (range && typeof range === 'string') {
          for (const part of range.split(',')) {
            if (part.includes('-')) {
              const [a, b] = part.split('-').map(n => Number(n));
              const start = Math.max(1, Math.min(a, b));
              const end = Math.min(doc.numPages, Math.max(a, b));
              for (let p = start; p <= end; p++) pages.push(p);
            } else {
              const p = Number(part);
              if (!Number.isNaN(p)) pages.push(Math.max(1, Math.min(doc.numPages, p)));
            }
          }
          pages = Array.from(new Set(pages)).sort((x,y)=>x-y);
        }
        if (pages.length === 0) {
          for (let i = 1; i <= doc.numPages; i++) pages.push(i);
        }
        for (const i of pages) {
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale });
          const canvas = createCanvas(viewport.width, viewport.height);
          const ctx = canvas.getContext('2d');
          const renderContext = { canvasContext: ctx, viewport };
          await page.render(renderContext).promise;
          const imgBuf = canvas.toBuffer('image/png');
          zip.file(`page-${i}.png`, imgBuf);
        }
        convertedBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      } catch (e) {
        return res.status(501).json({
          error: 'Conversion PDF en ZIP d’images indisponible sur cette plateforme',
          details: e instanceof Error ? e.message : 'Module canvas manquant'
        });
      }
    } else if (originalExtension === '.pdf' && targetFormat === '.txt') {
      // Essai 1: pdf-parse via import ESM
      try {
        type PdfParseFn = (data: Buffer) => Promise<{ text?: string }>
        const modUnknown: unknown = await import('pdf-parse')
        const maybeDefault = (modUnknown as { default?: unknown }).default
        const pdfParse: PdfParseFn = typeof maybeDefault === 'function'
          ? (maybeDefault as PdfParseFn)
          : (modUnknown as unknown as PdfParseFn)
        const parsed = await pdfParse(buffer)
        convertedBuffer = Buffer.from((parsed?.text as string) || '');
      } catch {
        // Essai 2: pdf-parse via require (CJS)
        try {
          const nodeModule = await import('module');
          const require = nodeModule.createRequire(import.meta.url);
          const pdfParse = require('pdf-parse') as (data: Buffer) => Promise<{ text?: string }>
          const parsed = await pdfParse(buffer)
          convertedBuffer = Buffer.from((parsed?.text as string) || '');
        } catch {
          // Essai 3: fallback pdfjs-dist
          try {
            const nodeModule = await import('module');
            const require = nodeModule.createRequire(import.meta.url);
            const pdfjs = require('pdfjs-dist/legacy/build/pdf.js') as unknown as PdfJsModule;
            const doc = await pdfjs.getDocument({ data: buffer }).promise;
            let text = '';
            for (let i = 1; i <= doc.numPages; i++) {
              const page = await doc.getPage(i);
              const content = await page.getTextContent();
              const parts = (content.items as PdfJsTextItem[]).map((it) => (it.str ? it.str : '')).filter(Boolean);
              text += parts.join(' ') + '\n';
            }
            convertedBuffer = Buffer.from(text || '');
          } catch (e) {
            return res.status(500).json({
              error: 'Extraction de texte PDF indisponible',
              details: e instanceof Error ? e.message : 'Erreur inconnue'
            });
          }
        }
      }
    } else if (originalExtension === '.wav' && targetFormat === '.mp3') {
      const wavMod = await import('node-wav');
      const lamejs = await import('lamejs');
      const decoded = wavMod.decode(buffer);
      const channels = decoded.channelData.length;
      const sampleRate = decoded.sampleRate;
      const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
      const samples = decoded.channelData[0];
      const chunkSize = 1152;
      const mp3Data: Uint8Array[] = [];
      let i = 0;
      while (i < samples.length) {
        const sampleChunk = samples.subarray(i, i + chunkSize);
        const buf = mp3enc.encodeBuffer(sampleChunk);
        if (buf.length > 0) mp3Data.push(buf);
        i += chunkSize;
      }
      const end = mp3enc.flush();
      if (end.length > 0) mp3Data.push(end);
      convertedBuffer = Buffer.from(Buffer.concat(mp3Data.map(b => Buffer.from(b))));
    } else if (originalExtension === '.mp4' && targetFormat === '.mp3') {
      const tempDir = path.join(process.cwd(), 'temp');
      const inputName = `${fileId}-src${originalExtension}`;
      const outputName = `${fileId}-ffmpeg-${Date.now()}${targetFormat}`;
      const inputPath = path.join(tempDir, inputName);
      const outputPath = path.join(tempDir, outputName);
      await fs.writeFile(inputPath, buffer);
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .noVideo()
          .audioCodec('libmp3lame')
          .outputOptions(['-q:a 2'])
          .output(outputPath)
          .on('end', resolve)
          .on('error', reject)
          .run();
      });
      convertedBuffer = await fs.readFile(outputPath);
      await fs.unlink(inputPath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
    } else {
      return res.status(501).json({ 
        error: `Conversion de ${originalExtension} vers ${targetFormat} non encore implémentée`,
        message: 'Cette fonctionnalité sera disponible prochainement'
      });
    }

    // Génération d'un ID pour le fichier converti
    const convertedFileId = `${fileId}-converted-${Date.now()}${targetFormat}`;
    const convertedFilePath = path.join(process.cwd(), 'temp', convertedFileId);
    
    // Sauvegarde du fichier converti
    await fs.writeFile(convertedFilePath, convertedBuffer);

    res.json({
      success: true,
      originalFileId: fileId,
      convertedFileId,
      originalFormat: originalExtension,
      targetFormat,
      size: {
        original: buffer.length,
        converted: convertedBuffer.length
      },
      downloadUrl: `/api/download/${convertedFileId}`
    });

    if (user && user.plan === 'free') {
      try {
        const { pool } = await import('../db.js')
        await pool.query('UPDATE users SET conversionsUsed = conversionsUsed + 1, updatedAt = NOW() WHERE id = $1', [user.id])
      } catch {
        const r = conversionCounts.get(userKey);
        if (r) {
          r.count += 1;
          conversionCounts.set(userKey, r);
        }
      }
    }

  } catch (error) {
    console.error('Erreur lors de la conversion:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la conversion du fichier',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
});

export default router;
