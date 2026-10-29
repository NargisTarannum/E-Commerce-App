import { getCurrentUser } from "@/lib/auth";
import { getProductsByIds } from "@/lib/api";
import { parseProductId } from "@/lib/validation";
import { rateLimit, tooMany } from "@/lib/rateLimit";
import { addProducts, getWishlistView, serverError } from "@/lib/wishlist";

export const dynamic = "force-dynamic";

const MAX_MERGE = 50;

// Merges a guest's locally saved product ids into the signed-in user's wishlist.
// Only ids are accepted; product data is always re-fetched from the catalog.
export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ message: "Please sign in." }, { status: 401 });

    const rl = rateLimit(`wishlist-merge:${user.id}`, { limit: 10, windowMs: 60 * 1000 });
    if (!rl.allowed) return tooMany(rl.retryAfter);

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ message: "Invalid request." }, { status: 400 });
    }
    if (!Array.isArray(body?.productIds)) {
      return Response.json({ message: "Invalid request." }, { status: 400 });
    }

    const ids = [...new Set(body.productIds.slice(0, MAX_MERGE).map(parseProductId).filter(Boolean))];

    if (ids.length) {
      const found = (await getProductsByIds(ids)).filter((r) => r.product).map((r) => r.product);
      await addProducts(user.id, found);
    }

    return Response.json({ items: await getWishlistView(user.id) });
  } catch (err) {
    return serverError("wishlist:merge", err);
  }
}
