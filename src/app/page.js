import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import { products } from "../data/products";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Products</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}