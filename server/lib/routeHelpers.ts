import { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from '../middleware/auth.js';

/** Extracts the authenticated userId from the request (set by authMiddleware). */
export function getUserId(req: Request): string 
{
  return (req as Request & { user?: JwtPayload }).user!.userId;
}

/** Optionally extracts userId if authenticated (set by optionalAuth). */
export function getOptionalUserId(req: Request): string | undefined 
{
  return (req as Request & { user?: JwtPayload }).user?.userId;
}

/** Formats a Date to ISO date string (YYYY-MM-DD). */
export function toISODate(date: Date): string 
{
  return date.toISOString().split('T')[0];
}

/** Wraps an async route handler to catch errors and return 500. */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) 
{
  return (req: Request, res: Response, next: NextFunction) => 
  {
    fn(req, res, next).catch((e) => 
    {
      console.error(e);
      res.status(500).json({ error: 'Serverfehler' });
    });
  };
}
