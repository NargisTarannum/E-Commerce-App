// Run from the project root:  node scripts/check-db.js
// Diagnoses the MongoDB connection without printing credentials.
const fs = require("fs");
const path = require("path");
const dns = require("dns");
const mongoose = require("mongoose");

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const mask = (s) => String(s || "").replace(/\/\/[^@\s/]*@/g, "//***@");

(async () => {
  const env = loadEnv();
  const uri = env.MONGODB_URI || process.env.MONGODB_URI;
  const dbName = env.MONGODB_DB || process.env.MONGODB_DB || "authDB";

  if (!uri) return console.log("FAIL  MONGODB_URI is missing from .env.local");

  const dnsServers = env.MONGODB_DNS_SERVERS || process.env.MONGODB_DNS_SERVERS;
  if (dnsServers) {
    const list = dnsServers.split(",").map((s) => s.trim()).filter(Boolean);
    dns.setServers(list);
    dns.promises.setServers(list);
    console.log(`using MONGODB_DNS_SERVERS override: ${dnsServers}`);
  }

  const m = uri.match(/^(mongodb(?:\+srv)?):\/\/(?:([^:@/]*)(?::([^@/]*))?@)?([^/?]+)(\/[^?]*)?(\?.*)?$/);
  if (!m) return console.log("FAIL  MONGODB_URI is not a valid mongodb:// or mongodb+srv:// string");
  const [, scheme, user, pass, host] = m;
  console.log(`scheme=${scheme} host=${host} user=${user ? "set" : "MISSING"} password=${pass ? "set" : "MISSING"} db=${dbName}`);
  if (/[<>]/.test(uri)) console.log("WARN  URI still contains <placeholder> brackets");
  console.log(`system DNS servers: ${dns.getServers().join(", ")}`);

  if (scheme === "mongodb+srv") {
    try {
      const r = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
      console.log(`OK    DNS SRV lookup (system resolver): ${r.length} host(s)`);
    } catch (e) {
      console.log(`FAIL  DNS SRV lookup (system resolver): ${e.code}`);
    }
  }

  const started = Date.now();
  try {
    await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10000 });
    const count = await mongoose.connection.db.collection("users").countDocuments();
    console.log(`PASS  connected to "${dbName}" in ${Date.now() - started}ms; users collection has ${count} document(s)`);
  } catch (e) {
    const text = `${e.name} ${e.code || ""} ${e.message}`;
    let kind = "unknown";
    if (/ENOTFOUND|ENODATA/.test(text)) kind = "DNS: hostname does not exist";
    else if (/querySrv|ECONNREFUSED.*53|EAI_AGAIN/.test(text) || e.code === "ECONNREFUSED") kind = "DNS/network: resolver or port refused the connection";
    else if (/auth|Authentication failed|bad auth/i.test(text)) kind = "authentication: wrong username or password";
    else if (/ETIMEDOUT|Server selection timed out|MongooseServerSelectionError/.test(text)) kind = "network timeout / IP not in Atlas Network Access list";
    else if (/ssl|tls|certificate/i.test(text)) kind = "TLS/SSL problem";
    console.log(`FAIL  ${e.name}${e.code ? ` (${e.code})` : ""} after ${Date.now() - started}ms`);
    console.log(`      likely category: ${kind}`);
    console.log(`      detail: ${mask(String(e.message).split("\n")[0])}`);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
