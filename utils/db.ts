import mongoose from 'mongoose';

// Load environment variables
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/staffaivcrt';

// Only throw error in production, use default in development
if (!process.env.MONGODB_URL && process.env.NODE_ENV === 'production') {
  console.warn('MONGODB_URL not defined in environment, using default connection');
}

// Define the type for the cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add mongoose to the NodeJS global type
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize the cached connection
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Set the global mongoose cache
global.mongoose = cached;

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
