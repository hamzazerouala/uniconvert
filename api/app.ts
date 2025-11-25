/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
} from 'express'
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
 * error handler middleware
 */
app.use(errorLogger)

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
