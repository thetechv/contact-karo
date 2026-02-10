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
    globalAny._mongo.promise = mongoose
      .connect(MONGODB_URI)
      .then((m) => m);
  }

  globalAny._mongo.conn = await globalAny._mongo.promise;
  return globalAny._mongo.conn;
}

export default dbConnect;
