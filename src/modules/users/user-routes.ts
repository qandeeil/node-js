import { Router } from 'express';
import { UserController } from './user-controller';
import { validateBody } from '../../middlewares/validate-middleware';
import { userCreateSchema } from './user-validate';
import { authenticateJWT } from '../../middlewares/auth-middleware';

const router = Router();
const controller = new UserController();

router.post('/create', validateBody(userCreateSchema),controller.createUser.bind(controller));
router.post('/login', controller.loginUser.bind(controller));
router.get('/me', authenticateJWT, controller.getMe.bind(controller));

export default router;
