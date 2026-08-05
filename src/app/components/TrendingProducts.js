"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://dummyjson.com/products?limit=24"
        );

        const data = await response.json();

        setProducts(data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-200 dark:bg-slate-700 py-14">
        <h2 className="text-4xl font-bold mb-8">
          Trending Products
        </h2>

        <p>Loading...</p>
      </section>
    );
  }

  return (
   <section className="bg-slate-200 dark:bg-slate-700 py-16">
  <div className="px-5">

    <h2 className="text-5xl font-bold mb-10 text-black dark:text-white">
      Trending Products
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
{products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

    </div>

  </div>

</section>
  );
}