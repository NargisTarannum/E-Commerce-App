import { getCurrentUser } from "@/lib/auth";
import { parseProductId } from "@/lib/validation";
import { rateLimit, tooMany } from "@/lib/rateLimit";
import { removeProduct, serverError } from "@/lib/wishlist";

export const dynamic = "force-dynamic";

// Removes one product from the signed-in user's own wishlist (idempotent).
export async function DELETE(_req, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ message: "Please sign in." }, { status: 401 });

    const rl = rateLimit(`wishlist:${user.id}`, { limit: 120, windowMs: 60 * 1000 });
    if (!rl.allowed) return tooMany(rl.retryAfter);

    const productId = parseProductId((await params).productId);
    if (!productId) return Response.json({ message: "Invalid product." }, { status: 400 });

    return Response.json({ removed: await removeProduct(user.id, productId) });
  } catch (err) {
    return serverError("wishlist:remove", err);
  }
}
