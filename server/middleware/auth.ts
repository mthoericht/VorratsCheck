import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Security: JWT signing/verification secret; must be set to a strong value in production
const JWT_SECRET = process.env.JWT_SECRET ?? 'vorratscheck-dev-secret-change-in-production';

if (JWT_SECRET === 'vorratscheck-dev-secret-change-in-production')
{
  console.warn('[auth] WARNING: Using default JWT_SECRET – set JWT_SECRET in .env for production');
}

export interface JwtPayload {
  userId: string;
  email: string;
}

// Security: require Authorization: Bearer <token>; verify JWT with algorithm whitelist to avoid algorithm confusion
export function authMiddleware(req: Request, res: Response, next: NextFunction) 
{
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) 
  {
    res.status(401).json({ error: 'Nicht authentifiziert' });
    return;
  }
  const token = authHeader.slice(7);
  try 
  {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload;
    (req as Request & { user?: JwtPayload }).user = payload;
    next();
  }
  catch 
  {
    res.status(401).json({ error: 'Ungültiger oder abgelaufener Token' });
  }
}

// Security: same JWT verification as authMiddleware but optional (e.g. for /api/deals)
export function optionalAuth(req: Request, _res: Response, next: NextFunction) 
{
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) 
  {
    try 
    {
      const payload = jwt.verify(authHeader.slice(7), JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload;
      (req as Request & { user?: JwtPayload }).user = payload;
    }
    catch 
    {
      // ignore
    }
  }
  next();
}

// Security: issue JWT with fixed expiry (7d) so tokens cannot be valid indefinitely
export function signToken(payload: JwtPayload): string 
{
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
