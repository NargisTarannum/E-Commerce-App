import { getProductsByIds } from "@/lib/api";
import { parseProductId } from "@/lib/validation";
import { clientIp, rateLimit, tooMany } from "@/lib/rateLimit";
import { toView } from "@/lib/wishlist";

export const dynamic = "force-dynamic";

const MAX_IDS = 50;

// Public: returns current price/stock for catalog products. Used to refresh a
// guest's locally saved wishlist. Contains no user data.
export async function GET(req) {
  const rl = rateLimit(`wishlist-lookup:${clientIp(req)}`, { limit: 30, windowMs: 60 * 1000 });
  if (!rl.allowed) return tooMany(rl.retryAfter);

  const raw = new URL(req.url).searchParams.get("ids") ?? "";
  const ids = [...new Set(raw.split(",").slice(0, MAX_IDS).map(parseProductId).filter(Boolean))];
  if (!ids.length) return Response.json({ items: [], missing: [] });

  const results = await getProductsByIds(ids);
  return Response.json({
    items: results.filter((r) => r.product).map((r) => toView(r.product)),
    missing: results.filter((r) => r.missing).map((r) => r.id),
  });
}
