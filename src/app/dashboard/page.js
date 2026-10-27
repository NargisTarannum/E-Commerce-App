import Navbar from "../components/Navbar";
import Hero from "../../components/sections/Hero";
import Features from "../components/Features";
import TrendingProducts from "../components/TrendingProducts";
import Banner from "../../components/sections/PromoBanner";


export default function Home() {
  return (
    <div>
      <Navbar />
       <Hero />
      <Features />
      <TrendingProducts />
      <Banner />
    </div>
  );
}
