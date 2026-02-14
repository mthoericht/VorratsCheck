import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../middleware/auth.js';

const INVITE_CODE = process.env.INVITE_CODE ?? 'VORRATSCHECK2026';

export const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => 
{
  try 
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
      res.status(401).json({ error: 'Benutzer nicht gefunden' });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) 
    {
      res.status(401).json({ error: 'Falsches Passwort' });
      return;
    }
    const token = signToken({ userId: user.id, email: user.email });
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

authRouter.post('/signup', async (req: Request, res: Response) => 
{
  try 
  {
    const { username, email, password, inviteCode } = req.body;
    if (!username || !email || !password || !inviteCode) 
    {
      res.status(400).json({ error: 'Alle Felder erforderlich' });
      return;
    }
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
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });
    const token = signToken({ userId: user.id, email: user.email });
    res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  }
  catch (e) 
  {
    console.error(e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});
