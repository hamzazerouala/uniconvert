import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  
  // Log du body pour les requêtes POST/PUT
  if (method === 'POST' || method === 'PUT') {
    console.log(`[${timestamp}] Body:`, req.body);
  }
  
  next();
};

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  void next
  console.error(`[${new Date().toISOString()}] Error:`, error.message);
  console.error('Stack:', error.stack);
  
  res.status(500).json({
    success: false,
    error: 'Server internal error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
};
