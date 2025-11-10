import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { validateBody, validateQuery } from '../middlewares/validateMiddleware';
import { z } from 'zod';
import {
  createBranch,
  getBranches,
  getBranch,
  updateBranch,
  deleteBranch
} from '../controllers/branchController';

const router = express.Router();

const branchSchema = z.object({
  name: z.string(),
  address: z.string().optional()
});

const listQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional()
});

router.use(protect);

router.get('/', validateQuery(listQuery), authorize('ADMIN', 'PASTOR', 'USER'), getBranches);
router.post('/', validateBody(branchSchema), authorize('ADMIN'), createBranch);
router.get('/:id', authorize('ADMIN', 'PASTOR', 'USER'), getBranch);
router.put('/:id', validateBody(branchSchema), authorize('ADMIN'), updateBranch);
router.delete('/:id', authorize('ADMIN'), deleteBranch);

export default router;