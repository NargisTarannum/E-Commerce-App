"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, Star, ImageOff } from "lucide-react";
import { useCart } from "@/context/CartContext";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product, priority = false }) {
  const {
    name,
    slug,
    category,
    price,
    oldPrice,
    rating,
    reviews,
    tag,
    image,
  } = product;

  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;
  const hasRating = typeof rating === "number" && rating > 0;
  const href = `/products/${slug}`;

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="group relative flex flex-col">
      {/* Image area */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 block"
        >
          {imageFailed || !image ? (
            <div className="grid h-full w-full place-items-center text-muted">
              <ImageOff size={32} strokeWidth={1.5} />
            </div>
          ) : (
            <Image
              src={image}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              onError={() => setImageFailed(true)}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
              -{discount}%
            </span>
          )}
          {tag && (
            <span className="rounded-full bg-canvas/90 px-2.5 py-1 text-[11px] font-semibold leading-none text-ink backdrop-blur">
              {tag}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <WishlistButton product={product} className="absolute right-3 top-3" />

        {/* Add to cart: always visible on touch, slides up on hover/focus for mouse users */}
        <div className="absolute inset-x-3 bottom-3 transition duration-300 [@media(hover:hover)]:translate-y-[130%] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
              added
                ? "bg-clay text-white"
                : "bg-ink text-canvas hover:bg-clay"
            }`}
          >
            {added ? (
              <>
                <Check size={16} strokeWidth={2} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={16} strokeWidth={1.75} /> Add to cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Screen-reader confirmation */}
      <span role="status" className="sr-only">
        {added ? `${name} added to cart` : ""}
      </span>

      {/* Info */}
      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {category}
        </p>

        <h3 className="font-display text-base font-medium leading-snug sm:text-lg">
          <Link href={href} className="transition-colors hover:text-clay">
            {name}
          </Link>
        </h3>

        {hasRating && (
          <div
            className="flex items-center gap-1.5 text-xs text-muted"
            aria-label={`Rated ${rating} out of 5 from ${reviews} reviews`}
          >
            <Star size={14} className="fill-clay text-clay" aria-hidden="true" />
            <span className="font-medium text-ink">{rating.toFixed(1)}</span>
            <span aria-hidden="true">({reviews})</span>
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-semibold">{formatPrice(price)}</span>
          {discount > 0 && (
            <>
              <s className="text-sm text-muted">{formatPrice(oldPrice)}</s>
              <span className="sr-only">
                {discount}% off, was {formatPrice(oldPrice)}
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}