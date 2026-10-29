"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

// variant="icon": round heart for product cards (position it with className).
// variant="button": labelled pill for product detail pages.
export default function WishlistButton({ product, variant = "icon", className = "" }) {
  const { isWishlisted, toggle } = useWishlist();
  const saved = isWishlisted(product.id);

  const label = saved
    ? `Remove ${product.name} from wishlist`
    : `Add ${product.name} to wishlist`;

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={() => toggle(product)}
        aria-pressed={saved}
        aria-label={label}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium transition-colors hover:border-ink hover:bg-sand ${className}`}
      >
        <Heart size={18} strokeWidth={1.75} className={saved ? "fill-clay text-clay" : ""} aria-hidden="true" />
        {saved ? "Saved to wishlist" : "Add to wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={saved}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-full bg-canvas/90 text-ink shadow-sm backdrop-blur transition duration-200 hover:scale-110 hover:bg-canvas active:scale-95 ${className}`}
    >
      <Heart
        size={18}
        strokeWidth={1.75}
        className={`transition-colors ${saved ? "fill-clay text-clay" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}
