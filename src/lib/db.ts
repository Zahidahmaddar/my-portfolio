import mongoose from 'mongoose';

// Encode credentials so passwords with special characters work, without
// double-encoding a URI that is already encoded
function encodeMongoURI(uri: string): string {
  const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):(.+)@([^@]+)$/);
  if (!match) return uri;
  const [, scheme, user, password, rest] = match;
  return `${scheme}${encodeOnce(user)}:${encodeOnce(password)}@${rest}`;
}

function encodeOnce(value: string): string {
  try {
    return encodeURIComponent(decodeURIComponent(value));
  } catch {
    return encodeURIComponent(value);
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global is used here to maintain a cached connection across hot reloads in development
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    cached!.promise = mongoose.connect(encodeMongoURI(uri), opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
