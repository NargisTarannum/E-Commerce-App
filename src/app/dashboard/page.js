import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import TrendingProducts from "../components/TrendingProducts";


export default function Home() {
  return (
    <div>
      <Navbar />
       <Hero />
      <Features />
      <TrendingProducts />
    </div>
  );
}
