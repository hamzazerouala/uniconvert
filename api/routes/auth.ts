/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'

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

// DB-backed auth: users stored in Postgres
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
  try {
    await pool.query(
      `INSERT INTO users (id,email,name,plan,passwordHash,salt,conversionsUsed,maxConversions)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [record.id, record.email, record.name ?? null, record.plan, record.passwordHash, record.salt, record.conversionsUsed, record.maxConversions]
    )
  } catch (e: any) {
    if (e?.code === '23505') { // unique_violation
      res.status(409).json({ error: 'Utilisateur déjà enregistré' })
      return
    }
    res.status(500).json({ error: 'Erreur base de données', details: e?.message || 'unknown' })
    return
  }
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
  const r = await pool.query<UserRecord>('SELECT * FROM users WHERE email = $1', [email])
  const record = r.rows[0]
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
