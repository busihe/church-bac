import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { validateBody, validateQuery } from '../middlewares/validateMiddleware';
import { z } from 'zod';
import {
  createContribution,
  getContributions,
  getContribution,
  updateContribution,
  deleteContribution
} from '../controllers/contributionController';

const router = express.Router();

const contributionSchema = z.object({
  amount: z.number(),
  date: z.string().optional(),
  type: z.string().optional(),
  note: z.string().optional(),
  memberId: z.number().optional(),
  pastorId: z.number().optional(),
  branchId: z.number().optional()
});

const listQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional()
});

router.use(protect);

router.get('/', validateQuery(listQuery), authorize('ADMIN', 'PASTOR'), getContributions);
router.post('/', validateBody(contributionSchema), authorize('ADMIN', 'PASTOR'), createContribution);
router.get('/:id', authorize('ADMIN', 'PASTOR'), getContribution);
router.put('/:id', validateBody(contributionSchema), authorize('ADMIN', 'PASTOR'), updateContribution);
router.delete('/:id', authorize('ADMIN'), deleteContribution);

export default router;