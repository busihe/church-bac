import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (e: any) {
    return res.status(400).json({ success: false, message: 'Validation error', details: e.errors || e });
  }
};

export const validateQuery = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (e: any) {
    return res.status(400).json({ success: false, message: 'Validation error', details: e.errors || e });
  }
};