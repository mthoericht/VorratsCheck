import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../middleware/auth.js';
import { asyncHandler } from '../lib/routeHelpers.js';

// Security: invite code restricts signup (e.g. private beta); set a strong value in production
const INVITE_CODE = process.env.INVITE_CODE ?? 'VORRATSCHECK2026';

if (INVITE_CODE === 'VORRATSCHECK2026')
{
  console.warn('[auth] WARNING: Using default INVITE_CODE – set INVITE_CODE in .env for production');
}

export const authRouter = Router();

authRouter.post('/login', asyncHandler(async (req, res) => 
{
  const { email, password } = req.body;
  if (!email || !password) 
  {
    res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
    return;
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) 
  {
    // Security: same message as wrong password to avoid user enumeration
    res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    return;
  }
  // Security: constant-time comparison via bcrypt; passwords are stored hashed (see signup)
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) 
  {
    res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    return;
  }
  const token = signToken({ userId: user.id, email: user.email });
  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
}));

authRouter.post('/signup', asyncHandler(async (req, res) => 
{
  const { username, email, password, inviteCode } = req.body;
  if (!username || !email || !password || !inviteCode) 
  {
    res.status(400).json({ error: 'Alle Felder erforderlich' });
    return;
  }
  // Security: enforce invite code before creating user
  if (inviteCode !== INVITE_CODE) 
  {
    res.status(400).json({ error: 'Ungültiges Einladungspasswort' });
    return;
  }
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) 
  {
    const field = existing.email === email ? 'E-Mail' : 'Benutzername';
    res.status(409).json({ error: `${field} bereits vergeben` });
    return;
  }
  // Security: hash password with bcrypt (cost 10) before storing; never store plaintext
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, passwordHash },
  });
  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
}));
