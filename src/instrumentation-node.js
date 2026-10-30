import dns from "node:dns";

const servers = (process.env.MONGODB_DNS_SERVERS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

console.log("[DNS] Instrumentation loaded");
console.log("[DNS] Configured servers:", servers);

if (servers.length) {
  dns.setServers(servers);
  // The MongoDB driver resolves SRV records through dns.promises, which has its own server list.
  dns.promises.setServers(servers);
  console.log("[DNS] Active servers:", dns.getServers(), "| promises:", dns.promises.getServers());
}