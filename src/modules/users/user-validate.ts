import Joi from 'joi';

export const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18),
});
