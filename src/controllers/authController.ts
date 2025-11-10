import { Request, Response } from 'express';
import prisma from '../db';
import bcrypt from 'bcrypt';
import { generateToken } from '../utilis/generateToken';
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

export async function register(req: Request, res: Response) {
  const { email, password, name, role } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role: role ?? 'USER' }
    });

    const token = generateToken({ id: user.id, role: user.role });
    return res.status(201).json({ success: true, data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Registration failed', details: err });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken({ id: user.id, role: user.role });
    return res.json({ success: true, data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Login failed', details: err });
  }
}