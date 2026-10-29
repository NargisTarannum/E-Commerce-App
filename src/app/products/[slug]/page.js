import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductActions from "@/components/product/ProductActions";
import Button from "@/components/ui/Button";
import { getProduct } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { parseProductId } from "@/lib/validation";

const LOW_STOCK = 5;

async function load(params) {
  const id = parseProductId((await params).slug);
  if (!id) notFound();
  try {
    return { product: await getProduct(id) };
  } catch (error) {
    console.error("[product] failed to load:", error.message);
    return { product: null, failed: true };
  }
}

export async function generateMetadata({ params }) {
  const { product } = await load(params);
  return { title: product ? `${product.name} | Maison Aurel` : "Product | Maison Aurel" };
}

export default async function ProductPage({ params }) {
  const { product, failed } = await load(params);

  if (!failed && !product) notFound();

  if (failed) {
    return (
      <>
        <AnnouncementBar />
        <Header />
        <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-medium">We couldn&apos;t load this product</h1>
          <p className="mt-3 text-muted">Please check your connection and try again.</p>
          <Button href="/" variant="accent" className="mt-8">
            Back to shop
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  const { price, oldPrice, stock } = product;
  const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const outOfStock = stock === 0;
  const lowStock = !outOfStock && stock !== null && stock <= LOW_STOCK;
  const image = product.images[0] ?? product.image;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <span>{product.category}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand">
            {image && (
              <Image
                src={image}
                alt={product.imageAlt}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            )}
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-clay px-3 py-1.5 text-xs font-semibold leading-none text-white">
                -{discount}%
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              {product.brand ? `${product.brand} · ` : ""}
              {product.category}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            {product.rating > 0 && (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                <Star size={16} className="fill-clay text-clay" aria-hidden="true" />
                <span className="font-medium text-ink">{product.rating.toFixed(1)}</span>
                <span>({product.reviews} reviews)</span>
              </div>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl font-semibold">{formatPrice(price)}</span>
              {discount > 0 && (
                <>
                  <s className="text-muted">{formatPrice(oldPrice)}</s>
                  <span className="text-sm font-medium text-clay">{discount}% off</span>
                </>
              )}
            </div>

            <p
              className={`mt-3 text-sm font-medium ${
                outOfStock ? "text-red-700" : lowStock ? "text-amber-700" : "text-green-700"
              }`}
            >
              {outOfStock ? "Out of stock" : lowStock ? `Only ${stock} left` : "In stock"}
            </p>

            {product.description && (
              <p className="mt-6 leading-relaxed text-muted">{product.description}</p>
            )}

            <ProductActions product={product} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
