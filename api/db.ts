import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL || ''
export const pool = new Pool({ connectionString })

export async function ensureSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      plan TEXT NOT NULL DEFAULT 'free',
      passwordHash TEXT NOT NULL,
      salt TEXT NOT NULL,
      conversionsUsed INTEGER NOT NULL DEFAULT 0,
      maxConversions INTEGER NOT NULL DEFAULT 1,
      createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

export async function touchUpdatedAt(userId: string): Promise<void> {
  await pool.query('UPDATE users SET updatedAt = NOW() WHERE id = $1', [userId])
}
