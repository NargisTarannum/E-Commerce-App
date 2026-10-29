"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import WishlistButton from "@/components/wishlist/WishlistButton";

export default function ProductActions({ product }) {
  const { addItem } = useCart();
  const toast = useToast();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    addItem(product);
    toast.show(`${product.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button
        variant="primary"
        onClick={handleAdd}
        disabled={outOfStock}
        className="flex-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink"
      >
        {added ? (
          <>
            <Check size={16} aria-hidden="true" /> Added
          </>
        ) : (
          <>
            <ShoppingBag size={16} strokeWidth={1.75} aria-hidden="true" />
            {outOfStock ? "Out of stock" : "Add to cart"}
          </>
        )}
      </Button>
      <WishlistButton product={product} variant="button" className="flex-1" />
    </div>
  );
}
