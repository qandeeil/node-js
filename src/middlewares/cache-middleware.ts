import config from '../config';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export async function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!config.useCache) {
    console.log("⚠️ Cache disabled — skipping cache check.");
    return next();
  }

  const { default: Redis } = await import('ioredis');
  const redisClient = new Redis(config.redisUrl);

  const bodyString = req.body && Object.keys(req.body).length > 0
    ? JSON.stringify(req.body)
    : '';

  const hash = crypto.createHash('md5').update(bodyString).digest('hex');
  const key = `cache:${req.originalUrl}:${hash}`;

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
