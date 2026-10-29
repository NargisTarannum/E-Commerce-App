import Wishlist from "@/models/Wishlist";
import { describeDbError } from "@/lib/db";
import { getProductsByIds } from "@/lib/api";

export const MAX_ITEMS = 100;

const toSnapshot = (p) => ({
  productId: p.id,
  slug: String(p.slug ?? p.id),
  name: String(p.name).slice(0, 200),
  category: p.category ?? "",
  price: p.price,
  oldPrice: p.oldPrice ?? null,
  image: p.image ?? null,
});

// Shape sent to the browser (same fields the cart and product cards use).
const toView = (p) => ({
  id: p.id,
  slug: String(p.slug ?? p.id),
  name: p.name,
  category: p.category ?? "",
  price: p.price,
  oldPrice: p.oldPrice ?? null,
  image: p.image ?? null,
  imageAlt: p.imageAlt ?? p.name,
  stock: p.stock ?? null,
  unavailable: Boolean(p.unavailable),
});

async function ensureWishlist(userId) {
  try {
    await Wishlist.updateOne(
      { user: userId },
      { $setOnInsert: { user: userId, items: [] } },
      { upsert: true }
    );
  } catch (err) {
    if (err?.code !== 11000) throw err; // a concurrent request created it first
  }
}

// Adds products (normalized objects) that aren't already saved.
// The filter makes the add atomic, so duplicates can't be created even by
// parallel requests, and the wishlist can't grow past MAX_ITEMS.
export async function addProducts(userId, products) {
  await ensureWishlist(userId);
  let added = 0;
  for (const p of products) {
    const res = await Wishlist.updateOne(
      {
        user: userId,
        "items.productId": { $ne: p.id },
        [`items.${MAX_ITEMS - 1}`]: { $exists: false },
      },
      { $push: { items: { $each: [toSnapshot(p)], $position: 0 } } }
    );
    if (res.modifiedCount) added += 1;
  }
  return added;
}

export async function removeProduct(userId, productId) {
  // Matching on the item keeps the result accurate (a bare $pull would still
  // bump `updatedAt` and always look like a change).
  const res = await Wishlist.updateOne(
    { user: userId, "items.productId": productId },
    { $pull: { items: { productId } } }
  );
  return res.modifiedCount > 0;
}

// The user's items with live price/stock. Falls back to the saved snapshot
// when the catalog API is down, and flags products that no longer exist.
export async function getWishlistView(userId) {
  const doc = await Wishlist.findOne({ user: userId }).lean();
  const saved = doc?.items ?? [];
  if (!saved.length) return [];

  const results = await getProductsByIds(saved.map((i) => i.productId));
  return saved.map((s, i) => {
    const r = results[i];
    if (r.product) return toView(r.product);
    return toView({
      id: s.productId,
      slug: s.slug,
      name: s.name,
      category: s.category,
      price: s.price,
      oldPrice: s.oldPrice,
      image: s.image,
      stock: null,
      unavailable: r.missing,
    });
  });
}

export { toView };

export function serverError(tag, err) {
  console.error(`[${tag}]`, describeDbError(err), String(err?.message ?? "").split("\n")[0].slice(0, 160));
  return Response.json({ message: "Something went wrong. Please try again." }, { status: 500 });
}
