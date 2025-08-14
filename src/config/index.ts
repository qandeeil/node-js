import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/mydb",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  defaultLanguage: "en",
  cacheExpirationInMinutes: Number(process.env.CACHE_EXPIRATION_MINUTES) || 10,
  useDatabase: process.env.USE_DATABASE === "true",
  useCache: process.env.USE_CACHE === "true",
  jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  useRoles: process.env.USE_ROLES === "true", // default true; set to false to disable role checks
  corsOrigins: (process.env.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
};
