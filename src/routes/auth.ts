import express from 'express';
import { register, login } from '../controllers/authController';
import { validateBody } from '../middlewares/validateMiddleware';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'PASTOR', 'USER']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);

export default router;