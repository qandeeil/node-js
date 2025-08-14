import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    t: (key: string, options?: Record<string, any>) => string;
    user?: import('../../utils/jwt').JwtUser;
  }
}
