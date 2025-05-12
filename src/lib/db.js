import mongoose from "mongoose";

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error("Please define MONGO_URL in .env.local");
}

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(uri, {
      dbName,
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB with Mongoose");
  } catch (err) {
    console.error("❌ Mongoose connection error:", err);
    throw err;
  }
};

export { connectToDatabase };
