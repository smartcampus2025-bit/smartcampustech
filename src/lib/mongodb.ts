import { MongoClient } from "mongodb";
import { env } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = env.MONGODB_URI;

if (!uri && process.env.NODE_ENV === "production") {
  throw new Error("[SmartCampusTech] MONGODB_URI is not set");
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise && uri) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export const mongoClientPromise = clientPromise;

