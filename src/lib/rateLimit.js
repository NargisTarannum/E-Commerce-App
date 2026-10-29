// In-memory fixed-window limiter. Good for a single server process; on
// serverless / multi-instance hosting swap the Map for Redis or Upstash.
const buckets = global._rateBuckets || (global._rateBuckets = new Map());

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || b.reset <= now) {
    b = { count: 0, reset: now + windowMs };
    buckets.set(key, b);
  }
  b.count += 1;

  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
  }

  return {
    allowed: b.count <= limit,
    retryAfter: Math.max(1, Math.ceil((b.reset - now) / 1000)),
  };
}

export function clientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : req.headers.get("x-real-ip")) || "unknown";
}

export function tooMany(retryAfter) {
  return Response.json(
    { message: "Too many attempts. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}
