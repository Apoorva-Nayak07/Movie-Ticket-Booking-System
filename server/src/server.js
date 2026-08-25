require("dotenv").config();

const app = require("./app");
const env = require("./config/env");
const prisma = require("./config/database");

const {
  connectMongoDB,
  disconnectMongoDB,
} = require("./config/mongodb");

const {
  connectRedis,
  disconnectRedis,
} = require("./config/redis");

async function startServer() {
  try {
    // PostgreSQL
    await prisma.$connect();
    console.log("✅ PostgreSQL connected");

    // MongoDB
    await connectMongoDB();

    // Redis
    await connectRedis();

    // Start Express
    app.listen(env.port, () => {
      console.log(
        `🚀 CineSync API running on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

async function shutdown() {
  console.log("\n🛑 Shutting down CineSync...");

  await prisma.$disconnect();
  await disconnectMongoDB();
  await disconnectRedis();

  console.log("✅ Connections closed");

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);