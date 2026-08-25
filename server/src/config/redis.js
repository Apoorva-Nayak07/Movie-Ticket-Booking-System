const { createClient } = require("redis");
const env = require("./env");

const redis = createClient({
  url: env.redisUrl,
});

redis.on("error", (error) => {
  console.error("❌ Redis error:", error);
});

redis.on("connect", () => {
  console.log("🔄 Redis connecting...");
});

redis.on("ready", () => {
  console.log("✅ Redis ready");
});

async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

async function disconnectRedis() {
  if (redis.isOpen) {
    await redis.quit();
  }
}

module.exports = {
  redis,
  connectRedis,
  disconnectRedis,
};