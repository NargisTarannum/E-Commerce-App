import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <img
        src={product.image}
        className="w-full h-48 object-cover rounded"
      />

      <h3 className="text-lg font-semibold mt-3">
        {product.name}
      </h3>

      <p className="text-gray-600">₹{product.price}</p>

      <Link href={`/product/${product.id}`}>
        <button className="mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          View Product
        </button>
      </Link>
    </div>
  );
}