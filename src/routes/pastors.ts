import express from 'express';
import {
  createPastor,
  getPastors,
  getPastor,
  updatePastor,
  deletePastor
} from '../controllers/pastorController';
import { protect, authorize } from '../middlewares/authMiddleware';
import { validateBody, validateQuery } from '../middlewares/validateMiddleware';
import { z } from 'zod';

const router = express.Router();

const pastorSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  branchId: z.number().optional(),
  userId: z.number().optional()
});

const listQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional()
});

router.use(protect);

router.get('/', validateQuery(listQuery), authorize('ADMIN', 'PASTOR'), getPastors);
router.post('/', validateBody(pastorSchema), authorize('ADMIN'), createPastor);
router.get('/:id', authorize('ADMIN', 'PASTOR'), getPastor);
router.put('/:id', validateBody(pastorSchema), authorize('ADMIN'), updatePastor);
router.delete('/:id', authorize('ADMIN'), deletePastor);

export default router;