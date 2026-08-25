const mongoose = require("mongoose");
const env = require("./env");

async function connectMongoDB() {
  try {
    await mongoose.connect(env.mongoUri);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

async function disconnectMongoDB() {
  await mongoose.disconnect();
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};