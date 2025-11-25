import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface pour l'utilisateur authentifié
interface AuthenticatedUser {
  id: string;
  email: string;
  plan: 'free' | 'pro' | 'premium';
  conversionsUsed: number;
  maxConversions: number;
}

// Middleware pour vérifier l'authentification
declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé - Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// Middleware optionnel: n'exige pas de token; si présent et valide, attache l'utilisateur
export const maybeAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as AuthenticatedUser;
    req.user = decoded;
  } catch {
    return res.status(403).json({ error: 'Token invalide' });
  }
  next();
};

// Middleware pour vérifier les limites de conversion (freemium)
export const checkConversionLimit = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }

  // Les utilisateurs Pro et Premium ont des conversions illimitées
  if (user.plan === 'pro' || user.plan === 'premium') {
    return next();
  }

  // Les utilisateurs gratuits ont des limites
  if (user.conversionsUsed >= user.maxConversions) {
    return res.status(403).json({ 
      error: 'Limite de conversions atteinte',
      message: 'Veuillez passer à un plan Pro pour des conversions illimitées',
      upgradeUrl: '/pricing'
    });
  }

  next();
};

// Middleware pour vérifier l'accès premium
export const requirePremium = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }

  if (user.plan !== 'pro' && user.plan !== 'premium') {
    return res.status(403).json({ 
      error: 'Accès Premium requis',
      message: 'Cette fonctionnalité nécessite un abonnement Pro ou Premium',
      upgradeUrl: '/pricing'
    });
  }

  next();
};

export {}
