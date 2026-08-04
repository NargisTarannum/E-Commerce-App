import Navbar from "../components/Navbar";
// import ProductCard from "../components/ProductCard";
// import { products } from "../../data/products";
import Hero from "../components/Hero";
import Features from "../components/Features";


export default function Home() {
  return (
    <div>
      <Navbar />
       <Hero />
      <Features />
    </div>
  );
}

 {/* <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Products</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div> */}