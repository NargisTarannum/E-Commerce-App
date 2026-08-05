import Image from "next/image";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  return (
   <div
  key={product.id}
  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 overflow-hidden transition hover:shadow-lg"
>
  {/* Product Image */}
  <div className="h-[300px] flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
    <Image
      src={product.thumbnail}
      alt={product.title}
      width={220}
      height={220}
      className="object-contain h-[220px] w-auto"
    />
  </div>

  {/* Product Details */}
  <div className="p-5">

    <p className="text-sm capitalize text-gray-500 dark:text-gray-400">
      {product.category}
    </p>

    <h3 className="mt-2 text-xl font-semibold text-black dark:text-white line-clamp-2">
      {product.title}
    </h3>

    <div className="flex items-center gap-2 mt-2">
      <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>

      <span className="text-gray-700 dark:text-gray-300">
        {product.rating}
      </span>
    </div>

    <div className="mt-3">
      <p className="text-3xl font-semibold text-blue-600">
        ${product.price}
      </p>

      <div className="flex items-center justify-between mt-2">

        <div>
          <span className="line-through text-gray-500 dark:text-gray-400">
            $
            {(
              product.price /
              (1 - product.discountPercentage / 100)
            ).toFixed(2)}
          </span>

          <span className="ml-2 font-semibold text-black dark:text-white">
            -{product.discountPercentage}%
          </span>
        </div>

        <button className="w-12 h-12 rounded bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center transition">
          🛒
        </button>

      </div>

    </div>

  </div>
</div>
  );
}