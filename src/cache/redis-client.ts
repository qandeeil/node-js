import Redis from "ioredis";
import config from "../config";

let redisClient: Redis | null = null;
if (config.useCache) {
  redisClient = new Redis(config.redisUrl);

  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });
}

export default redisClient;
