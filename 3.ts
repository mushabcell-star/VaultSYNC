import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

/**
 * Middleware untuk memvalidasi JWT Access Token
 */
export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Akses ditolak' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid' });
    req.user = user;
    next();
  });
};

/**
 * Middleware Rate Limiter untuk mencegah Brute Force
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5,
  message: {
    message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});