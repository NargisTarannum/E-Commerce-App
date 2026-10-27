"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, ImageOff } from "lucide-react";
import Button from "@/components/ui/Button";
import SafeImage from "@/components/ui/SafeImage";
import { MAX_QTY, useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

function CartSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your cart" className="animate-pulse">
      <div className="h-10 w-48 rounded-full bg-sand" />
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {[0, 1].map((i) => (
            <div key={i} className="h-36 rounded-3xl bg-sand" />
          ))}
        </div>
        <div className="h-72 rounded-3xl bg-sand lg:col-span-4" />
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center sm:py-24">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-sand text-clay">
        <ShoppingBag size={32} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-medium tracking-tight sm:text-4xl">
        Your cart is empty
      </h1>
      <p className="mt-3 text-muted">
        Looks like you haven&apos;t added anything yet. Explore the new
        arrivals and find something you love.
      </p>
      <Button href="/#new-arrivals" className="mt-8 px-7 py-3.5">
        Continue shopping
      </Button>
    </div>
  );
}

function CartItemRow({ item }) {
  const { increment, decrement, removeItem } = useCart();
  const { id, slug, name, category, price, oldPrice, image, imageAlt, quantity } = item;
  const lineTotal = Math.round(price * quantity * 100) / 100;

  return (
    <li className="flex gap-4 rounded-3xl border border-line bg-white/60 p-3 sm:gap-6 sm:p-4">
      <Link
        href={`/products/${slug}`}
        className="relative block aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-2xl bg-sand sm:w-32"
      >
        {image ? (
          <SafeImage
            src={image}
            alt={imageAlt}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-muted">
            <ImageOff size={24} strokeWidth={1.5} aria-hidden="true" />
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {category && (
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                {category}
              </p>
            )}
            <h2 className="mt-1 font-display text-base font-medium leading-snug sm:text-lg">
              <Link
                href={`/products/${slug}`}
                className="transition-colors hover:text-clay"
              >
                {name}
              </Link>
            </h2>
            <p className="mt-1 flex items-baseline gap-2 text-sm">
              <span className="text-ink">{formatPrice(price)}</span>
              {oldPrice && oldPrice > price && (
                <s className="text-muted">{formatPrice(oldPrice)}</s>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => removeItem(id)}
            aria-label={`Remove ${name} from cart`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-clay"
          >
            <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div
            role="group"
            aria-label={`Quantity of ${name}`}
            className="inline-flex items-center rounded-full border border-line bg-canvas"
          >
            <button
              type="button"
              onClick={() => decrement(id)}
              disabled={quantity <= 1}
              aria-label={`Decrease quantity of ${name}`}
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Minus size={16} aria-hidden="true" />
            </button>
            <span
              aria-live="polite"
              className="w-8 text-center text-sm font-medium tabular-nums"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => increment(id)}
              disabled={quantity >= MAX_QTY}
              aria-label={`Increase quantity of ${name}`}
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
          </div>

          <p className="text-base font-semibold tabular-nums">
            <span className="sr-only">Line total: </span>
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>
    </li>
  );
}

export default function CartView() {
  const { items, hydrated, itemCount, subtotal, clearCart } = useCart();

  const handleClear = () => {
    if (window.confirm("Remove all items from your cart?")) clearCart();
  };

  return (
    <section
      aria-labelledby="cart-title"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16"
    >
      {!hydrated ? (
        <CartSkeleton />
      ) : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1
                id="cart-title"
                className="font-display text-4xl font-medium tracking-tight sm:text-5xl"
              >
                Your cart
              </h1>
              <p className="mt-2 text-muted">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-clay hover:underline"
            >
              Clear cart
            </button>
          </div>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
            <ul className="space-y-4 lg:col-span-8">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </ul>

            <aside
              aria-labelledby="summary-title"
              className="rounded-3xl border border-line bg-sand p-6 sm:p-8 lg:sticky lg:top-28 lg:col-span-4"
            >
              <h2
                id="summary-title"
                className="font-display text-2xl font-medium"
              >
                Order summary
              </h2>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">
                    Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </dt>
                  <dd className="font-medium tabular-nums">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="text-muted">Calculated at checkout</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-4 text-base">
                  <dt className="font-semibold">Estimated total</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
              </dl>

              <Button href="/checkout" variant="accent" className="mt-6 w-full py-3.5">
                Proceed to checkout
              </Button>
              <Button href="/#new-arrivals" variant="outline" className="mt-3 w-full py-3.5">
                Continue shopping
              </Button>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}
