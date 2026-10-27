import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartView from "@/components/cart/CartView";

export const metadata = {
  title: "Your cart | Maison Aurel",
};

export default function CartPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main">
        <CartView />
      </main>
      <Footer />
    </>
  );
}