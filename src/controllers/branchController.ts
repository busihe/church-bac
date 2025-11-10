import { Request, Response } from 'express';
import prisma from '../db';

function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Number(req.query.limit || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export async function getBranches(req: Request, res: Response) {
  const { search } = req.query as any;
  const { limit, skip } = parsePagination(req);
  const where: any = {};
  if (search) {
    where.name = { contains: String(search), mode: 'insensitive' };
  }
  const [data, total] = await Promise.all([
    prisma.branch.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.branch.count({ where })
  ]);
  return res.json({ success: true, data: { items: data, total } });
}

export async function createBranch(req: Request, res: Response) {
  const payload = req.body;
  const branch = await prisma.branch.create({ data: payload });
  return res.status(201).json({ success: true, data: branch });
}

export async function getBranch(req: Request, res: Response) {
  const id = Number(req.params.id);
  const branch = await prisma.branch.findUnique({ where: { id } });
  if (!branch) return res.status(404).json({ success: false, message: 'Branch not found' });
  return res.json({ success: true, data: branch });
}

export async function updateBranch(req: Request, res: Response) {
  const id = Number(req.params.id);
  const payload = req.body;
  const branch = await prisma.branch.update({ where: { id }, data: payload });
  return res.json({ success: true, data: branch });
}

export async function deleteBranch(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.branch.delete({ where: { id } });
  return res.json({ success: true, message: 'Branch deleted' });
}