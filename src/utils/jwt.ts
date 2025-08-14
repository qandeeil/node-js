import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import config from '../config';

export type JwtUser = {
  id?: string;
  email: string;
  role?: string;
  name?: string;
};

export function signToken(user: JwtUser) {
  const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
  const secret: Secret = config.jwtSecret as Secret;
  const options: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): JwtUser {
  const secret: Secret = config.jwtSecret as Secret;
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === 'string') {
    // unexpected string payload, return minimal
    return { email: decoded } as JwtUser;
  }
  const data = decoded as JwtPayload & { sub?: string; role?: string; name?: string; email?: string };
  return {
    id: data.sub,
    email: data.email || '',
    role: data.role,
    name: data.name,
  };
}
