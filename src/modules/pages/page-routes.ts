import { Router, Request, Response } from 'express';
import { PageService } from './page-service';

const router = Router();
const service = new PageService();

router.get('/', async (req: Request, res: Response) => {
  const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
  const cursor = (req.query.cursor as string) || undefined;
  const result = await service.list(limit, cursor);
  res.json(result);
});

export default router;
