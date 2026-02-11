import mongoose from "mongoose";

// Cache connection globally (good pattern 👍)
const globalAny = global;

if (!globalAny._mongo) {
  globalAny._mongo = { conn: null, promise: null };
}

async function dbConnect() {
  if (globalAny._mongo.conn) {
    return globalAny._mongo.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  if (!globalAny._mongo.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering to fail fast if not connected
      serverSelectionTimeoutMS: 5000, // Fail after 5s if DB is unreachable
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    globalAny._mongo.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch((err) => {
      console.error("MongoDB connection failed, clearing promise cache:", err);
      globalAny._mongo.promise = null; // Clear promise so we can retry next time
      throw err;
    });
  }

  try {
    globalAny._mongo.conn = await globalAny._mongo.promise;
  } catch (e) {
    globalAny._mongo.promise = null; // Ensure promise is cleared on await failure too
    throw e;
  }

  return globalAny._mongo.conn;
}

export default dbConnect;
