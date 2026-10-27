import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import ProductGrid from "@/components/sections/ProductGrid";
import PromoBanner from "@/components/sections/PromoBanner";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";
import { getCategories, getHomeProducts, getTestimonials } from "@/lib/api";

async function safe(promise, label) {
  try {
    return await promise;
  } catch (error) {
    console.error(`[home] ${label} failed:`, error);
    return null;
  }
}

export default async function HomePage() {
  const [products, categories, testimonials] = await Promise.all([
    safe(getHomeProducts(), "products"),
    safe(getCategories(), "categories"),
    safe(getTestimonials(), "testimonials"),
  ]);

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main id="main">
        <Hero />
        <Categories categories={categories} />

        {products ? (
          <>
            <ProductGrid
              id="featured"
              eyebrow="Top rated"
              title="Featured pieces"
              description="The styles our customers rate highest."
              items={products.featured}
            />
            <PromoBanner />
            <ProductGrid
              id="new-arrivals"
              eyebrow="Just landed"
              title="New arrivals"
              description="Fresh additions to the collection."
              items={products.newArrivals}
            />
          </>
        ) : (
          <p
            role="alert"
            className="mx-auto max-w-7xl px-4 py-24 text-center text-muted sm:px-6 lg:px-8"
          >
            We couldn't load products right now. Please try again shortly.
          </p>
        )}

        <Testimonials items={testimonials} />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}