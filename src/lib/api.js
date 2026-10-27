const BASE_URL = process.env.API_BASE_URL ?? "https://dummyjson.com";

const FASHION_CATEGORIES = [
  "womens-dresses",
  "tops",
  "mens-shirts",
  "womens-shoes",
  "mens-shoes",
  "womens-bags",
];

// Five tiles = one large + four small in the bento grid.
const CATEGORY_TILES = [
  { slug: "womens-dresses", label: "Dresses" },
  { slug: "mens-shirts", label: "Shirts" },
  { slug: "tops", label: "Tops" },
  { slug: "womens-shoes", label: "Footwear" },
  { slug: "womens-bags", label: "Bags" },
];

async function request(path, { revalidate = 300 } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`API request failed (${res.status}) for ${path}`);
  }
  return res.json();
}

const formatCategory = (slug = "") =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// If you change APIs, this is the main function to edit.
export function normalizeProduct(raw) {
  const original = Number(raw.price);
  const discount = Number(raw.discountPercentage) || 0;
  const hasDiscount = discount >= 1;

  return {
    id: raw.id,
    slug: String(raw.id),
    name: raw.title,
    category: formatCategory(raw.category),
    price: hasDiscount
      ? Math.round(original * (1 - discount / 100) * 100) / 100
      : original,
    oldPrice: hasDiscount ? original : null,
    rating: typeof raw.rating === "number" ? raw.rating : null,
    reviews: Array.isArray(raw.reviews) ? raw.reviews.length : 0,
    tag: null,
    image: raw.thumbnail,
    imageAlt: raw.title,
    createdAt: raw.meta?.createdAt ?? null,
  };
}

async function getFashionProducts() {
  const results = await Promise.allSettled(
    FASHION_CATEGORIES.map((category) =>
      request(`/products/category/${category}?limit=8`)
    )
  );

  const products = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value.products)
    .map(normalizeProduct);

  if (products.length === 0) {
    throw new Error("Could not load products from the API.");
  }
  return products;
}

export async function getHomeProducts({ limit = 4 } = {}) {
  const all = await getFashionProducts();

  const featured = [...all]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);

  const newArrivals = [...all]
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return b.id - a.id;
    })
    .filter((p) => !featured.some((f) => f.id === p.id))
    .slice(0, limit)
    .map((p) => ({ ...p, tag: "New" }));

  return { featured, newArrivals };
}

// Category tiles: name from CATEGORY_TILES, image and count from the API.
export async function getCategories() {
  const results = await Promise.allSettled(
    CATEGORY_TILES.map(async ({ slug, label }) => {
      const data = await request(
        `/products/category/${slug}?limit=1&select=thumbnail,title`,
        { revalidate: 3600 }
      );
      const first = data.products?.[0];
      if (!first) return null;
      return {
        slug,
        name: label,
        count: data.total ?? 0,
        image: first.thumbnail,
        href: `/category/${slug}`,
      };
    })
  );

  return results
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);
}

// Testimonials built from real product reviews returned by the API.
export async function getTestimonials({ limit = 3 } = {}) {
  const data = await request(
    "/products/category/womens-dresses?limit=12&select=title,reviews",
    { revalidate: 3600 }
  );

  const seen = new Set();
  return (data.products ?? [])
    .flatMap((p) =>
      (p.reviews ?? []).map((r) => ({
        id: `${p.id}-${r.reviewerEmail}`,
        name: r.reviewerName,
        product: p.title,
        quote: r.comment,
        rating: r.rating,
      }))
    )
    .filter((r) => r.rating >= 4 && r.quote && r.name)
    .filter((r) => {
      if (seen.has(r.name)) return false;
      seen.add(r.name);
      return true;
    })
    .slice(0, limit);
}
// Searches the API, then keeps only fashion categories so a search for
// "case" doesn't return phone cases, for example.
export async function searchProducts(query, { limit = 24 } = {}) {
  const q = String(query ?? "").trim().slice(0, 80);
  if (!q) return [];

  const data = await request(
    `/products/search?q=${encodeURIComponent(q)}&limit=100`,
    { revalidate: 60 }
  );

  return (data.products ?? [])
    .filter((p) => FASHION_CATEGORIES.includes(p.category))
    .slice(0, limit)
    .map(normalizeProduct);
}