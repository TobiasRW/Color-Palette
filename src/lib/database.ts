import mongoose, { Mongoose } from "mongoose";

if (!process.env.MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable.");
}

const MONGODB_URI: string = process.env.MONGO_URI;

// ✅ Use interface instead of var
interface MongooseGlobal {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// ✅ Use globalThis instead of var in global scope
declare global {
  var mongoose: MongooseGlobal | undefined;
}

// ✅ Use a cached connection in development to prevent multiple connections
let cached = globalThis.mongoose ?? { conn: null, promise: null };

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
  globalThis.mongoose = cached; // ✅ Store the connection globally
  return cached.conn;
}

export default dbConnect;
