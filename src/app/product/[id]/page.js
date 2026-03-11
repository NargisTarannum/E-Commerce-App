"use client";


import { useDispatch } from "react-redux";
import { addToCart } from "../../../store/cartSlice";
import { products } from "../../../data/products";
import { useParams } from "next/navigation";

export default function ProductDetail() {
  const dispatch = useDispatch();
  const params = useParams();

  const product = products.find(
    (p) => p.id === parseInt(params.id)
  );

  if (!product) return <h2>Product not found</h2>;

  return (
    <div>
      {/* <Navbar /> */}
      <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-6">
        <img
          src={product.image}
          className="w-full h-80 object-cover rounded"
        />

        <div>
          <h1 className="text-2xl font-bold mt-3">
            {product.name}
          </h1>

          <p className="text-xl text-gray-700 mt-2">
            ₹{product.price}
          </p>

          <button
            onClick={() => dispatch(addToCart(product))}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}