import { Request, Response, NextFunction } from "express";
import { UserService } from "./user-service";
import STATUS_CODES from "../../utils/status-codes";

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);
      res.status(STATUS_CODES.CREATED).json(user);
    } catch (err) {
      next(err);
    }
  }
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(STATUS_CODES.ACCEPTED).json({
        name: "Mahmoud Qandeel",
      });
    } catch (err) {
      next(err);
    }
  }
}
