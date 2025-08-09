import { Router } from 'express';
import { UserController } from './user-controller';
import { validateBody } from '../../middlewares/validate-middleware';
import { userCreateSchema } from './user-validate';
import { cacheMiddleware } from '../../middlewares/cache-middleware';

const router = Router();
const controller = new UserController();

router.post('/', validateBody(userCreateSchema),controller.createUser.bind(controller));
router.get('/', cacheMiddleware,controller.getUser.bind(controller));

export default router;
