import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export function validateBody(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const detail = error.details[0];

      const type = detail.type; 
      const key = detail.context?.key;


      let translationKey = `validation:${key}.${type}`;

      const message = req.t(translationKey, { key, ...detail.context, fallback: detail.message });

      return res.status(400).json({ message });
    }
    next();
  };
}
