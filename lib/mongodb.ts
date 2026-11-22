import { MongoClient, Db } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  const uri = process.env.MONGODB_URI;
  return typeof uri === 'string' && uri.trim().startsWith('mongodb');
}

let cachedClientPromise: Promise<MongoClient> | null = null;

export async function getMongoClientPromise(): Promise<MongoClient | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  const uri = process.env.MONGODB_URI!.trim();

  try {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        const client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
      }
      return await global._mongoClientPromise;
    } else {
      if (!cachedClientPromise) {
        const client = new MongoClient(uri);
        cachedClientPromise = client.connect();
      }
      return await cachedClientPromise;
    }
  } catch (error) {
    console.error('Error establishing MongoDB connection:', error);
    return null;
  }
}

export async function getDb(): Promise<Db | null> {
  const client = await getMongoClientPromise();
  if (!client) return null;
  const dbName = process.env.MONGODB_DB?.trim() || 'pulsequeue';
  return client.db(dbName);
}
