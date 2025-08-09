import { Request, Response, NextFunction } from 'express';
import config from '../config';
import redisClient from '../cache/redis-client';

export async function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = `cache:${req.originalUrl}`;
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log(`[Cache HIT] Key: ${key} — Returning cached data.`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(`[Cache MISS] Key: ${key} — No cache found, processing request.`);

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      const expirationSeconds = config.cacheExpirationInMinutes * 60;
      redisClient.set(key, JSON.stringify(body), 'EX', expirationSeconds);
      console.log(`[Cache SET] Key: ${key} — Data cached for ${config.cacheExpirationInMinutes} minutes.`);
      return originalJson(body);
    };

    next();
  } catch (error) {
    console.error(`[Cache ERROR] Key: ${key} — Error: ${error}`);
    next();
  }
}
