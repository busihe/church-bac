import { Request, Response } from 'express';
import prisma from '../db';

function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Number(req.query.limit || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export async function getMembers(req: Request, res: Response) {
  const { search, branchId, isActive } = req.query as any;
  const { limit, skip } = parsePagination(req);
  const where: any = {};
  if (search) {
    where.OR = [
      { firstName: { contains: String(search), mode: 'insensitive' } },
      { lastName: { contains: String(search), mode: 'insensitive' } },
      { email: { contains: String(search), mode: 'insensitive' } }
    ];
  }
  if (branchId) where.branchId = Number(branchId);
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const [data, total] = await Promise.all([
    prisma.member.findMany({ where, skip, take: limit, orderBy: { joinedAt: 'desc' } }),
    prisma.member.count({ where })
  ]);
  return res.json({ success: true, data: { items: data, total, page: Math.floor(skip / limit) + 1 } });
}

export async function createMember(req: Request, res: Response) {
  const payload = req.body;
  const member = await prisma.member.create({ data: payload });
  return res.status(201).json({ success: true, data: member });
}

export async function getMember(req: Request, res: Response) {
  const id = Number(req.params.id);
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
  return res.json({ success: true, data: member });
}

export async function updateMember(req: Request, res: Response) {
  const id = Number(req.params.id);
  const payload = req.body;
  const member = await prisma.member.update({ where: { id }, data: payload });
  return res.json({ success: true, data: member });
}

export async function deleteMember(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.member.delete({ where: { id } });
  return res.json({ success: true, message: 'Member deleted' });
}