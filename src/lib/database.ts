import mongoose, { Mongoose } from "mongoose";

if (!process.env.MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable.");
}

const MONGODB_URI: string = process.env.MONGO_URI;

// ✅ Use globalThis to avoid var in declare global
(globalThis as any).mongoose = (globalThis as any).mongoose || {
  conn: null,
  promise: null,
};

// ✅ Use const instead of let since cached is never reassigned
const cached = (globalThis as any).mongoose;

async function dbConnect() {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🌱 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully.");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  (globalThis as any).mongoose = cached; // ✅ Store the connection globally
  return cached.conn;
}

export default dbConnect;
