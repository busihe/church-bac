import { Request, Response } from 'express';
import prisma from '../db';

function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Number(req.query.limit || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export async function getPastors(req: Request, res: Response) {
  const { search } = req.query as any;
  const { limit, skip } = parsePagination(req);
  const where: any = {};
  if (search) {
    where.OR = [
      { firstName: { contains: String(search), mode: 'insensitive' } },
      { lastName: { contains: String(search), mode: 'insensitive' } },
      { email: { contains: String(search), mode: 'insensitive' } }
    ];
  }
  const [data, total] = await Promise.all([
    prisma.pastor.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.pastor.count({ where })
  ]);
  return res.json({ success: true, data: { items: data, total } });
}

export async function createPastor(req: Request, res: Response) {
  const payload = req.body;
  const pastor = await prisma.pastor.create({ data: payload });
  return res.status(201).json({ success: true, data: pastor });
}

export async function getPastor(req: Request, res: Response) {
  const id = Number(req.params.id);
  const pastor = await prisma.pastor.findUnique({ where: { id } });
  if (!pastor) return res.status(404).json({ success: false, message: 'Pastor not found' });
  return res.json({ success: true, data: pastor });
}

export async function updatePastor(req: Request, res: Response) {
  const id = Number(req.params.id);
  const payload = req.body;
  const pastor = await prisma.pastor.update({ where: { id }, data: payload });
  return res.json({ success: true, data: pastor });
}

export async function deletePastor(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.pastor.delete({ where: { id } });
  return res.json({ success: true, message: 'Pastor deleted' });
}