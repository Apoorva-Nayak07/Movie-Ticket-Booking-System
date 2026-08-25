require("dotenv").config();

const requiredEnv = [
  "DATABASE_URL",
  "MONGODB_URI",
  "REDIS_URL",
  "JWT_SECRET",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  mongoUri: process.env.MONGODB_URI,
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
};