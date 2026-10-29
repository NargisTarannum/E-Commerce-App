import { Inter, Fraunces } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import { WishlistProvider } from "@/context/WishlistContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata = {
  title: "Maison Aurel | Considered pieces for modern living",
  description:
    "Thoughtfully designed clothing and accessories, made to last and made to be loved.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen antialiased">
        <CartProvider>
          <ToastProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}