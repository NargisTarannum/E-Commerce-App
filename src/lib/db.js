
import mongoose from "mongoose";

const DB_NAME = process.env.MONGODB_DB || "authDB";

// Cache the connection across Next.js hot reloads.
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = {
    conn: null,
    promise: null,
  };
}

// Classify database connection errors.
export function describeDbError(err) {
  const text = `${err?.name} ${err?.code} ${err?.cause?.code} ${err?.message}`;

  let kind = "unknown";

  if (/ENOTFOUND|ENODATA/.test(text)) {
    kind = "dns-hostname-not-found";
  } else if (/querySrv|EAI_AGAIN|ECONNREFUSED/i.test(text)) {
    kind = "dns-or-connection-refused";
  } else if (/AuthenticationFailed|Authentication failed|bad auth/i.test(text)) {
    kind = "authentication-failed";
  } else if (/ETIMEDOUT|ServerSelection/i.test(text)) {
    kind = "cannot-reach-servers";
  } else if (/ssl|tls|certificate/i.test(text)) {
    kind = "tls-error";
  }

  return `${kind} (${err?.name || "Error"}${err?.code ? `, code ${err.code}` : ""})`;
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set in .env.local");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Log only non-sensitive connection details.
    const parsed = new URL(uri);

    console.log("[MongoDB] Hostname:", parsed.hostname);
    console.log("[MongoDB] Protocol:", parsed.protocol);
    console.log("[MongoDB] Mongoose version:", mongoose.version);

    cached.promise = mongoose
      .connect(uri, {
        dbName: DB_NAME,
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        console.error("[MongoDB] Connection failed:", {
          name: err?.name,
          code: err?.code,
          message: err?.message,
          cause: err?.cause?.message,
          causeCode: err?.cause?.code,
        });

        cached.promise = null;
        cached.conn = null;

        throw err;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
