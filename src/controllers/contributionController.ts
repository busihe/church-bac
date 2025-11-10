import { Request, Response } from 'express';
import prisma from '../db';

function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Number(req.query.limit || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export async function getContributions(req: Request, res: Response) {
  const { search } = req.query as any;
  const { limit, skip } = parsePagination(req);
  const where: any = {};
  if (search) {
    where.OR = [
      { note: { contains: String(search), mode: 'insensitive' } },
      { type: { contains: String(search), mode: 'insensitive' } }
    ];
  }
  const [data, total] = await Promise.all([
    prisma.contribution.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
    prisma.contribution.count({ where })
  ]);
  return res.json({ success: true, data: { items: data, total } });
}

export async function createContribution(req: Request, res: Response) {
  const payload = req.body;
  const contribution = await prisma.contribution.create({ data: { ...payload, amount: Number(payload.amount) } });
  return res.status(201).json({ success: true, data: contribution });
}

export async function getContribution(req: Request, res: Response) {
  const id = Number(req.params.id);
  const contribution = await prisma.contribution.findUnique({ where: { id } });
  if (!contribution) return res.status(404).json({ success: false, message: 'Contribution not found' });
  return res.json({ success: true, data: contribution });
}

export async function updateContribution(req: Request, res: Response) {
  const id = Number(req.params.id);
  const payload = req.body;
  const contribution = await prisma.contribution.update({ where: { id }, data: payload });
  return res.json({ success: true, data: contribution });
}

export async function deleteContribution(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.contribution.delete({ where: { id } });
  return res.json({ success: true, message: 'Contribution deleted' });
}