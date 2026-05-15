import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let clientPromise;

if (!global._mongoClientPromise) {
  global._mongoClientPromise = client.connect();
}
if (!uri) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

clientPromise = global._mongoClientPromise;

export default clientPromise;