import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export default function requestId(req: Request, res: Response, next: NextFunction) {
  const headerKey = 'x-request-id';
  const id = (req.headers[headerKey] as string) || randomUUID();
  // expose on request and response for logging and tracing
  (req as any).requestId = id;
  res.setHeader(headerKey, id);
  next();
}
