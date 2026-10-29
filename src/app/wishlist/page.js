import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WishlistView from "@/components/wishlist/WishlistView";

export const metadata = { title: "Wishlist | Maison Aurel" };

export default function WishlistPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <h1 className="mb-10 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Your wishlist
        </h1>
        <WishlistView />
      </main>
      <Footer />
    </>
  );
}
