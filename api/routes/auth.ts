/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

type Plan = 'free' | 'pro' | 'premium'
interface UserRecord {
  id: string
  email: string
  name?: string
  plan: Plan
  passwordHash: string
  salt: string
  conversionsUsed: number
  maxConversions: number
}

const users = new Map<string, UserRecord>()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const hashPassword = (password: string, salt?: string) => {
  const s = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, s, 10000, 64, 'sha512')
    .toString('hex')
  return { hash, salt: s }
}

const issueToken = (u: UserRecord) => {
  const payload = {
    id: u.id,
    email: u.email,
    plan: u.plan,
    conversionsUsed: u.conversionsUsed,
    maxConversions: u.maxConversions,
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

const router = Router()

/**
 * User Login
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body || {}
  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe requis' })
    return
  }
  if (users.has(email)) {
    res.status(409).json({ error: 'Utilisateur déjà enregistré' })
    return
  }
  const { hash, salt } = hashPassword(password)
  const record: UserRecord = {
    id: crypto.randomUUID(),
    email,
    name,
    plan: 'free',
    passwordHash: hash,
    salt,
    conversionsUsed: 0,
    maxConversions: 1,
  }
  users.set(email, record)
  const token = issueToken(record)
  res.status(201).json({
    success: true,
    token,
    user: { id: record.id, email: record.email, name: record.name },
    subscription: {
      plan: record.plan,
      status: 'active',
      conversionsUsed: record.conversionsUsed,
      maxConversions: record.maxConversions,
    },
  })
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe requis' })
    return
  }
  const record = users.get(email)
  if (!record) {
    res.status(401).json({ error: 'Identifiants invalides' })
    return
  }
  const { hash } = hashPassword(password, record.salt)
  if (hash !== record.passwordHash) {
    res.status(401).json({ error: 'Identifiants invalides' })
    return
  }
  const token = issueToken(record)
  res.json({
    success: true,
    token,
    user: { id: record.id, email: record.email, name: record.name },
    subscription: {
      plan: record.plan,
      status: 'active',
      conversionsUsed: record.conversionsUsed,
      maxConversions: record.maxConversions,
    },
  })
})

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true })
})

export default router
