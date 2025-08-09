import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/mydb",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  defaultLanguage: "en",
  cacheExpirationInMinutes: Number(process.env.CACHE_EXPIRATION_MINUTES) || 10,
  useDatabase: process.env.USE_DATABASE === "true"
};
