import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtUser } from '../utils/jwt';
import config from '../config';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.substring(7) : undefined;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const user = verifyToken(token) as JwtUser;
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    // If role checks are disabled, allow access for any authenticated user
    if (!config.useRoles) return next();
    if (roles.length === 0) return next();
    // When enabled, enforce presence and match of role
    if (!req.user.role) return res.status(403).json({ message: 'Forbidden' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    return next();
  };
}
