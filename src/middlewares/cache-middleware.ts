import config from '../config';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import redisClient from '../cache/redis-client';

export async function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only cache GET requests and only when cache is enabled and client exists
  if (!config.useCache || !redisClient || req.method !== 'GET') {
    return next();
  }

  // Build a stable cache key: METHOD:URL?QUERY_HASH
  const queryString = Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : '';
  const queryHash = crypto.createHash('md5').update(queryString).digest('hex');
  const key = `cache:${req.method}:${req.originalUrl}:${queryHash}`;

  try {
    const client = redisClient; // narrow type
    if (!client) return next();
    const cachedData = await client.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const originalJson = res.json.bind(res) as (body: any) => Response;
    (res as any).json = (body: any) => {
      const expirationSeconds = config.cacheExpirationInMinutes * 60;
      // Fire and forget; if it fails, we still return the response
      client.set(key, JSON.stringify(body), 'EX', expirationSeconds).catch(() => {});
      return originalJson(body);
    };

    next();
  } catch (error) {
    // On any cache error, proceed without blocking request
    return next();
  }
}
