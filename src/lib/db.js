import mongoose from "mongoose";

// DNS overrides (MONGODB_DNS_SERVERS) are applied at startup in src/instrumentation-node.js.
const DB_NAME = process.env.MONGODB_DB || "authDB";

// Safe, non-sensitive summary of a connection error for server logs.
export function describeDbError(err) {
  const text = `${err?.name} ${err?.code} ${err?.cause?.code} ${err?.message}`;
  let kind = "unknown";
  if (/ENOTFOUND|ENODATA/.test(text)) kind = "dns-hostname-not-found";
  else if (/querySrv|EAI_AGAIN/.test(text) || (err?.code === "ECONNREFUSED" && /dns|srv/i.test(text)))
    kind = "dns-resolver-refused";
  else if (/AuthenticationFailed|Authentication failed|bad auth/i.test(text)) kind = "authentication-failed";
  else if (/ETIMEDOUT|ServerSelection/i.test(text))
    kind = "cannot-reach-servers (usually your public IP is not in Atlas Network Access)";
  else if (/ssl|tls|certificate/i.test(text)) kind = "tls";
  return `${kind} (${err?.name}${err?.code ? `, code ${err.code}` : ""})`;
}

// Cache the connection across hot reloads and route invocations.
let cached = global._mongooseCache;
if (!cached) cached = global._mongooseCache = { conn: null, promise: null };

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in .env.local");

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { dbName: DB_NAME, bufferCommands: false })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
