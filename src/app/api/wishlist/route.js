import { getCurrentUser } from "@/lib/auth";
import { getProductById, normalizeProduct } from "@/lib/api";
import { parseProductId } from "@/lib/validation";
import { rateLimit, tooMany } from "@/lib/rateLimit";
import { addProducts, getWishlistView, serverError } from "@/lib/wishlist";

export const dynamic = "force-dynamic";

const UNAUTHORIZED = () => Response.json({ message: "Please sign in." }, { status: 401 });

// The signed-in user's wishlist. 401 for guests (the client then uses local storage).
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return UNAUTHORIZED();
    return Response.json({ items: await getWishlistView(user.id) });
  } catch (err) {
    return serverError("wishlist:get", err);
  }
}

// Adds one product. Safe to call twice: a duplicate is simply ignored.
export async function POST(req) {
  try {
    const user = await getCurrentUser();
    if (!user) return UNAUTHORIZED();

    const rl = rateLimit(`wishlist:${user.id}`, { limit: 120, windowMs: 60 * 1000 });
    if (!rl.allowed) return tooMany(rl.retryAfter);

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ message: "Invalid request." }, { status: 400 });
    }

    const productId = parseProductId(body?.productId);
    if (!productId) return Response.json({ message: "Invalid product." }, { status: 400 });

    let raw;
    try {
      raw = await getProductById(productId);
    } catch {
      return Response.json(
        { message: "We couldn't verify that product right now. Please try again." },
        { status: 502 }
      );
    }
    if (!raw) return Response.json({ message: "Product not found." }, { status: 404 });

    const added = await addProducts(user.id, [normalizeProduct(raw)]);
    return Response.json({ added: added > 0 }, { status: added > 0 ? 201 : 200 });
  } catch (err) {
    return serverError("wishlist:add", err);
  }
}
