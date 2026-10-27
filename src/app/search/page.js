import Link from "next/link";
import { SearchX } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/lib/api";

const SUGGESTIONS = ["Dress", "Shirt", "Shoes", "Bag", "Top"];

async function getQuery(searchParams) {
  const { q } = await searchParams;
  const value = Array.isArray(q) ? q[0] : q;
  return String(value ?? "").trim().slice(0, 80);
}

export async function generateMetadata({ searchParams }) {
  const query = await getQuery(searchParams);
  return {
    title: query ? `Search: ${query} | Maison Aurel` : "Search | Maison Aurel",
  };
}

function Suggestions() {
  return (
    <ul className="mt-6 flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map((term) => (
        <li key={term}>
          <Link
            href={`/search?q=${encodeURIComponent(term)}`}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-canvas"
          >
            {term}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Message({ title, text }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center sm:py-24">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-sand text-clay">
        <SearchX size={32} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="mt-6 font-display text-2xl font-medium sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-muted">{text}</p>
      <Suggestions />
    </div>
  );
}

export default async function SearchPage({ searchParams }) {
  const query = await getQuery(searchParams);

  let results = [];
  let failed = false;

  if (query) {
    try {
      results = await searchProducts(query);
    } catch (error) {
      console.error("[search] failed:", error);
      failed = true;
    }
  }

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main id="main">
        <section
          aria-labelledby="search-title"
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-clay">
            Search
          </p>
          <h1
            id="search-title"
            className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl"
          >
            {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search the shop"}
          </h1>

          {query && !failed && (
            <p role="status" className="mt-3 text-muted">
              {results.length === 0
                ? "No products found"
                : `${results.length} ${results.length === 1 ? "product" : "products"} found`}
            </p>
          )}

          {!query ? (
            <Message
              title="What are you looking for?"
              text="Use the search icon in the header, or try one of these."
            />
          ) : failed ? (
            <p role="alert" className="py-16 text-center text-muted">
              We couldn&apos;t run your search right now. Please try again shortly.
            </p>
          ) : results.length === 0 ? (
            <Message
              title="Nothing matched your search"
              text="Check the spelling or try a more general word like “dress” or “shoes”."
            />
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
              {results.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 4}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}