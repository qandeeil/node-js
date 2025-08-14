import { Request, Response, NextFunction } from 'express';
import { UserService } from './user-service';
import STATUS_CODES from '../../utils/status-codes';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body as {
        name: string;
        email: string;
        password: string;
      };
      const passwordHash = await hashPassword(password);
      const user = await userService.createUser({ name, email, passwordHash });
      const token = signToken({ id: user.id, email: user.email, name: user.name });
      res.status(STATUS_CODES.CREATED).json({ token, user });
    } catch (err) {
      next(err);
    }
  }
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      // Prefer fetching from store to return canonical/safe object
      let safe: any = null;
      if (req.user.email) {
        const found = await userService.findByEmail(req.user.email);
        if (found) {
          const { password: _password, _id, ...rest } = (found.toObject ? found.toObject() : (found as any)) as any;
          safe = { id: (_id ? _id.toString() : found.id?.toString?.()) || undefined, ...rest };
        }
      }
      if (!safe) {
        // fallback to token contents
        safe = {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
        };
      }
      return res.json(safe);
    } catch (err) {
      next(err);
    }
  }
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as { email: string; password: string };
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const found = await userService.findByEmail(email);
      if (!found) return res.status(401).json({ message: 'Invalid credentials' });
      const ok = await comparePassword(password, (found as any).password);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
      const token = signToken({
        id: (found as any)._id?.toString?.() || (found as any).id?.toString?.(),
        email: (found as any).email,
        name: (found as any).name,
      });
      const { password: _password, _id, ...rest } = (found.toObject ? found.toObject() : (found as any)) as any;
      const safe = { id: (_id ? _id.toString() : (found as any).id?.toString?.()) || undefined, ...rest };
      return res.json({ token, user: safe });
    } catch (err) {
      next(err);
    }
  }
}
