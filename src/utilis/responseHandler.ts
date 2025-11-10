import { Response } from 'express';

export function success(res: Response, data: any = null, message = 'OK', status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function error(res: Response, message = 'Error', status = 500, details: any = null) {
  return res.status(status).json({ success: false, message, details });
}