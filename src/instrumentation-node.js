import dns from "node:dns";

// mongodb+srv:// needs DNS SRV lookups. If the machine's resolver refuses them
// (querySrv ECONNREFUSED), set MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1 in .env.local.
const servers = (process.env.MONGODB_DNS_SERVERS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (servers.length) {
  dns.setServers(servers);
  dns.promises.setServers(servers); // the MongoDB driver uses the promise-based resolver
}
