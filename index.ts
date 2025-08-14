import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./src/modules/users/user-routes";
import config from "./src/config";
import i18nMiddleware from "./src/middlewares/i18n-middleware";
import { errorHandler } from "./src/middlewares/error-handler";
import logger, { httpStream } from "./src/utils/logger";
import redisClient from "./src/cache/redis-client";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("combined", { stream: httpStream }));
app.use(i18nMiddleware);

app.use("/api/users", userRoutes);

// Health check route
app.get("/health", async (_req, res) => {
  const health: any = { status: "ok" };
  try {
    if (config.useDatabase) {
      health.mongo = {
        connected: mongoose.connection.readyState === 1,
      };
    }
    if (config.useCache) {
      const client = redisClient;
      if (client) {
        await client.ping();
        health.redis = { connected: true };
      } else {
        health.redis = { connected: false };
      }
    }
  } catch (e) {
    health.status = "degraded";
    health.error = (e as Error).message;
  }
  res.json(health);
});

app.use(errorHandler);

let server: any;

if (process.env.NODE_ENV !== 'test') {
  if (config.useDatabase) {
    mongoose
      .connect(config.mongoUri)
      .then(() => {
        logger.info("✅ MongoDB connected");
        startServer();
      })
      .catch((err) => {
        logger.error("❌ MongoDB connection error:", err);
        process.exit(1);
      });
  } else {
    logger.warn("⚠️ Skipping MongoDB connection — USE_DATABASE=false");
    startServer();
  }
}

export { app };

function startServer() {
  server = app.listen(config.port, () => {
    logger.info(`🚀 Server running on port ${config.port}`);
  });
}

// ======================
// 🛡️ Global Error Handlers
// ======================

process.on("unhandledRejection", (reason) => {
  logger.error("⚠️ Unhandled Rejection:", reason as any);
  shutdown(1);
});

process.on("uncaughtException", (err) => {
  logger.error("💥 Uncaught Exception:", err);
  shutdown(1);
});

process.on("SIGINT", () => {
  logger.warn("🛑 Server shutting down (SIGINT)...");
  shutdown(0);
});
process.on("SIGTERM", () => {
  logger.warn("🛑 Server shutting down (SIGTERM)...");
  shutdown(0);
});

async function shutdown(exitCode: number) {
  try {
    if (server) {
      logger.info("⏳ Closing HTTP server...");
      server.close();
    }
    logger.info("⏳ Closing MongoDB connection...");
    await mongoose.connection.close();

    if (config.useCache && redisClient) {
      logger.info("⏳ Closing Redis connection...");
      try {
        await redisClient.quit();
      } catch (e) {
        logger.warn("Redis quit failed", e as any);
      }
    }

    logger.info("✅ Cleanup done. Exiting...");
    process.exit(exitCode);
  } catch (err) {
    logger.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
}
