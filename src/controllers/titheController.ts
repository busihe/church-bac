import { Request, Response } from 'express';
import prisma from '../db';

function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Number(req.query.limit || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export async function getTithes(req: Request, res: Response) {
  const { search, memberId, pastorId, branchId } = req.query as any;
  const { limit, skip } = parsePagination(req);
  const where: any = {};
  if (search) {
    where.note = { contains: String(search), mode: 'insensitive' };
  }
  if (memberId) where.memberId = Number(memberId);
  if (pastorId) where.pastorId = Number(pastorId);
  if (branchId) where.branchId = Number(branchId);

  const [data, total] = await Promise.all([
    prisma.tithe.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
    prisma.tithe.count({ where })
  ]);
  return res.json({ success: true, data: { items: data, total } });
}

export async function createTithe(req: Request, res: Response) {
  const payload = req.body;
  const tithe = await prisma.tithe.create({ data: { ...payload, amount: Number(payload.amount) } });
  return res.status(201).json({ success: true, data: tithe });
}

export async function getTithe(req: Request, res: Response) {
  const id = Number(req.params.id);
  const tithe = await prisma.tithe.findUnique({ where: { id } });
  if (!tithe) return res.status(404).json({ success: false, message: 'Tithe not found' });
  return res.json({ success: true, data: tithe });
}

export async function updateTithe(req: Request, res: Response) {
  const id = Number(req.params.id);
  const payload = req.body;
  const tithe = await prisma.tithe.update({ where: { id }, data: payload });
  return res.json({ success: true, data: tithe });
}

export async function deleteTithe(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.tithe.delete({ where: { id } });
  return res.json({ success: true, message: 'Tithe deleted' });
}