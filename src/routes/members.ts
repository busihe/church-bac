import express from 'express';
import {
  createMember,
  getMembers,
  getMember,
  updateMember,
  deleteMember
} from '../controllers/memberController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { z } from 'zod';
import { validateBody, validateQuery } from '../middlewares/validateMiddleware';

const router = express.Router();

const memberSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  branchId: z.number().optional()
});

const listQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  branchId: z.string().optional(),
  isActive: z.string().optional()
});

router.use(protect);

router.get('/', validateQuery(listQuery), authorize('ADMIN', 'PASTOR', 'USER'), getMembers);
router.post('/', validateBody(memberSchema), authorize('ADMIN', 'PASTOR'), createMember);
router.get('/:id', authorize('ADMIN', 'PASTOR', 'USER'), getMember);
router.put('/:id', validateBody(memberSchema), authorize('ADMIN', 'PASTOR'), updateMember);
router.delete('/:id', authorize('ADMIN'), deleteMember);

export default router;