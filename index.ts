import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./src/modules/users/user-routes";
import config from "./src/config";
import i18nMiddleware from "./src/middlewares/i18n-middleware";
import { cacheMiddleware } from "./src/middlewares/cache-middleware";
import { errorHandler } from "./src/middlewares/error-handler";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(i18nMiddleware);

app.use("/api/users", userRoutes);

app.use(errorHandler);

let server: any;

if (config.useDatabase) {
  mongoose
    .connect(config.mongoUri)
    .then(() => {
      console.log("✅ MongoDB connected");
      startServer();
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
} else {
  console.log("⚠️ Skipping MongoDB connection — USE_DATABASE=false");
  startServer();
}

function startServer() {
  server = app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
  });
}

// ======================
// 🛡️ Global Error Handlers
// ======================

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection:", reason);
  shutdown(1);
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  shutdown(1);
});

process.on("SIGINT", () => {
  console.log("🛑 Server shutting down (SIGINT)...");
  shutdown(0);
});
process.on("SIGTERM", () => {
  console.log("🛑 Server shutting down (SIGTERM)...");
  shutdown(0);
});

async function shutdown(exitCode: number) {
  try {
    if (server) {
      console.log("⏳ Closing HTTP server...");
      server.close();
    }
    console.log("⏳ Closing MongoDB connection...");
    await mongoose.connection.close();

    console.log("✅ Cleanup done. Exiting...");
    process.exit(exitCode);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
}
