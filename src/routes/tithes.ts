import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { validateBody, validateQuery } from '../middlewares/validateMiddleware';
import { z } from 'zod';
import {
  createTithe,
  getTithes,
  getTithe,
  updateTithe,
  deleteTithe
} from '../controllers/titheController';

const router = express.Router();

const titheSchema = z.object({
  amount: z.number(),
  date: z.string().optional(),
  note: z.string().optional(),
  memberId: z.number().optional(),
  pastorId: z.number().optional(),
  branchId: z.number().optional()
});

const listQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  memberId: z.string().optional(),
  pastorId: z.string().optional(),
  branchId: z.string().optional()
});

router.use(protect);

router.get('/', validateQuery(listQuery), authorize('ADMIN', 'PASTOR'), getTithes);
router.post('/', validateBody(titheSchema), authorize('ADMIN', 'PASTOR'), createTithe);
router.get('/:id', authorize('ADMIN', 'PASTOR'), getTithe);
router.put('/:id', validateBody(titheSchema), authorize('ADMIN', 'PASTOR'), updateTithe);
router.delete('/:id', authorize('ADMIN'), deleteTithe);

export default router;