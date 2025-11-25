import { Router, type Request, type Response } from 'express'
import type { Stripe } from 'stripe'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()

router.post('/api/billing/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { plan } = req.body || {}
    if (!plan || !['pro', 'premium'].includes(plan)) {
      res.status(400).json({ error: 'Plan invalide' })
      return
    }
    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) {
      res.status(501).json({ error: 'Paiement non configuré', message: 'Clé Stripe manquante' })
      return
    }
    let stripe: Stripe
    try {
      const mod = await import('stripe')
      stripe = new mod.default(secret)
    } catch {
      res.status(501).json({ error: 'Module Stripe non installé' })
      return
    }
    const priceId = plan === 'pro' ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_PREMIUM
    if (!priceId) {
      res.status(501).json({ error: 'Prix Stripe non configuré' })
      return
    }
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: (process.env.CLIENT_URL || 'http://localhost:5173') + '/account?status=success',
      cancel_url: (process.env.CLIENT_URL || 'http://localhost:5173') + '/pricing?status=cancel',
    })
    res.json({ url: session.url })
  } catch (err) {
    res.status(500).json({ error: 'Erreur de paiement', details: err instanceof Error ? err.message : 'Erreur inconnue' })
  }
})

export default router
