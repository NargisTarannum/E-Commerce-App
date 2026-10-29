"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import { formatPrice } from "@/lib/format";
import Button from "@/components/ui/Button";
import WishlistButton from "./WishlistButton";

const LOW_STOCK = 5;

function WishlistItem({ item }) {
  const { remove } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const outOfStock = item.unavailable || item.stock === 0;
  const lowStock = !outOfStock && item.stock !== null && item.stock <= LOW_STOCK;
  const discount =
    item.oldPrice && item.oldPrice > item.price
      ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
      : 0;
  const href = `/products/${item.slug}`;

  const moveToCart = async () => {
    if (outOfStock || busy) return;
    setBusy(true);
    addItem(item);
    // Only remove from the wishlist once the cart add has happened.
    const removed = await remove(item.id, { silent: true });
    toast.show(
      removed
        ? `${item.name} moved to your cart`
        : `${item.name} added to cart, but it couldn't be removed from your wishlist`,
      removed ? "success" : "error"
    );
    setBusy(false);
  };

  const removeItem = async () => {
    if (busy) return;
    setBusy(true);
    await remove(item.id);
    setBusy(false);
  };

  return (
    <li className="flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 block">
          {imageFailed || !item.image ? (
            <div className="grid h-full w-full place-items-center text-muted">
              <ImageOff size={32} strokeWidth={1.5} />
            </div>
          ) : (
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              onError={() => setImageFailed(true)}
              className={`object-cover ${outOfStock ? "opacity-60 grayscale" : ""}`}
            />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
              -{discount}%
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold leading-none text-canvas">
              {item.unavailable ? "No longer available" : "Out of stock"}
            </span>
          )}
        </div>

        <WishlistButton product={item} className="absolute right-3 top-3" />
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        {item.category && (
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{item.category}</p>
        )}
        <h3 className="font-display text-base font-medium leading-snug sm:text-lg">
          <Link href={href} className="transition-colors hover:text-clay">
            {item.name}
          </Link>
        </h3>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-semibold">{formatPrice(item.price)}</span>
          {discount > 0 && (
            <>
              <s className="text-sm text-muted">{formatPrice(item.oldPrice)}</s>
              <span className="sr-only">
                {discount}% off, was {formatPrice(item.oldPrice)}
              </span>
            </>
          )}
        </div>

        <p
          className={`text-xs font-medium ${
            outOfStock ? "text-red-700" : lowStock ? "text-amber-700" : "text-green-700"
          }`}
        >
          {outOfStock ? "Out of stock" : lowStock ? `Only ${item.stock} left` : "In stock"}
        </p>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <Button
            variant="primary"
            onClick={moveToCart}
            disabled={outOfStock || busy}
            className="w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink"
            aria-label={outOfStock ? `${item.name} is out of stock` : `Move ${item.name} to cart`}
          >
            <ShoppingBag size={16} strokeWidth={1.75} aria-hidden="true" />
            {outOfStock ? "Out of stock" : busy ? "Moving…" : "Move to cart"}
          </Button>
          <button
            type="button"
            onClick={removeItem}
            disabled={busy}
            aria-label={`Remove ${item.name} from wishlist`}
            className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-red-700 disabled:opacity-50"
          >
            <Trash2 size={15} strokeWidth={1.75} aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export default function WishlistView() {
  const { items, hydrated, authed, count } = useWishlist();

  if (!hydrated) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading your wishlist"
        className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8"
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <div className="aspect-[4/5] rounded-2xl bg-sand" />
            <div className="mt-4 h-4 w-3/4 rounded bg-sand" />
            <div className="mt-2 h-4 w-1/3 rounded bg-sand" />
          </div>
        ))}
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-12 text-center sm:py-20">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-sand text-clay">
          <Heart size={32} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-display text-2xl font-medium sm:text-3xl">Your wishlist is empty</h2>
        <p className="mt-3 text-muted">
          Tap the heart on any product to save it here for later.
        </p>
        <Button href="/" variant="accent" className="mt-8">
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <>
      {!authed && (
        <p className="mb-8 rounded-2xl bg-sand px-4 py-3 text-sm text-muted">
          Your wishlist is saved on this device.{" "}
          <Link href="/login?next=/wishlist" className="font-medium text-clay hover:underline">
            Sign in
          </Link>{" "}
          to keep it across devices.
        </p>
      )}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
        {items.map((item) => (
          <WishlistItem key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
}
