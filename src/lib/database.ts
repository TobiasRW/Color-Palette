import mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable.");
}

const MONGODB_URI: string = process.env.MONGO_URI;

// ✅ Define a proper type instead of using 'any'
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// ✅ Ensure globalThis has a properly typed cache
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// ✅ Use a cached connection if available
const cached: MongooseCache = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = cached;

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
        return mongoose.connection;
      });
  }

  cached.conn = await cached.promise;
  globalThis.mongooseCache = cached;
  return cached.conn;
}

export default dbConnect;
