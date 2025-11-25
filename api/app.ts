/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
} from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import convertRoutes from './routes/convert.js'
import downloadRoutes from './routes/download.js'
import billingRoutes from './routes/billing.js'
import { logger, errorLogger } from './middleware/logger.js'

// esm helpers removed as unused

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(logger)

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/', uploadRoutes)
app.use('/', convertRoutes)
app.use('/', downloadRoutes)
app.use('/', billingRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * capabilities
 */
app.get('/api/capabilities', async (_req: Request, res: Response) => {
  let pdfImage = false
  let pdfZipImages = false
  try {
    const nodeModule = await import('module')
    const require = nodeModule.createRequire(import.meta.url)
    require('pdfjs-dist/legacy/build/pdf.js')
    require('@napi-rs/canvas')
    pdfImage = true
    pdfZipImages = true
  } catch {
    pdfImage = false
    pdfZipImages = false
  }
  res.json({ pdfImage, pdfZipImages })
})

/**
 * error handler middleware
 */
app.use(errorLogger)

/**
 * 404 handler
 */
// Serve built frontend if available
const distDir = path.join(process.cwd(), 'dist')
app.use(express.static(distDir))
app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API not found' })
  }
  res.sendFile(path.join(distDir, 'index.html'))
})

export default app
