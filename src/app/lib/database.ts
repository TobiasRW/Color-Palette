import mongoose, { Mongoose } from "mongoose";

if (!process.env.MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable.");
}

const MONGODB_URI: string = process.env.MONGO_URI;

declare global {
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

// Use a cached connection in development to avoid multiple connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

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
  return cached.conn;
}

export default dbConnect;
