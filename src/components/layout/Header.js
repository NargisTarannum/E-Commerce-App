"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/data";
import { useCart } from "@/context/CartContext";

const QUICK_SEARCHES = ["Dress", "Shirt", "Shoes", "Bag"];

function IconButton({ label, children, badge, href, className = "", ...props }) {
  const classes = `relative grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-sand ${className}`;

  const badgeEl = badge ? (
    <span
      aria-hidden="true"
      className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[10px] font-semibold leading-none text-white"
    >
      {badge}
    </span>
  ) : null;

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes} {...props}>
        {children}
        {badgeEl}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} className={classes} {...props}>
      {children}
      {badgeEl}
    </button>
  );
}

export default function Header() {
  const router = useRouter();
  const { itemCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef(null);

  const cartBadge = itemCount > 99 ? "99+" : itemCount || null;
  const cartLabel =
    itemCount === 0
      ? "Cart"
      : `Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`;

  const closeSearch = () => setSearchOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) {
      searchInputRef.current?.focus();
      return;
    }
    router.push(`/search?q=${encodeURIComponent(term)}`);
    closeSearch();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Focus the input when the search panel opens.
  useEffect(() => {
    if (!searchOpen) return;
    const id = setTimeout(() => searchInputRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Mobile menu button */}
        <IconButton
          label="Open menu"
          className="lg:hidden"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} strokeWidth={1.75} />
        </IconButton>

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight sm:text-2xl lg:text-[1.65rem]"
        >
          {siteConfig.name}
          <span className="text-clay">.</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="group relative py-2 text-sm font-medium text-ink/80 transition-colors hover:text-ink"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-clay transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <IconButton
            label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            {searchOpen ? (
              <X size={20} strokeWidth={1.75} />
            ) : (
              <Search size={20} strokeWidth={1.75} />
            )}
          </IconButton>
          <IconButton label="Account" className="hidden sm:grid">
            <User size={20} strokeWidth={1.75} />
          </IconButton>
          <IconButton label="Wishlist" className="hidden sm:grid">
            <Heart size={20} strokeWidth={1.75} />
          </IconButton>
          <IconButton href="/cart" label={cartLabel} badge={cartBadge}>
            <ShoppingBag size={20} strokeWidth={1.75} />
          </IconButton>
        </div>
      </div>

      {/* Expanding search panel */}
      <div
        id="site-search"
        className={`grid overflow-hidden transition-all duration-300 ${
          searchOpen ? "grid-rows-[1fr] border-t border-line" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0" inert={!searchOpen}>
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <form
              role="search"
              onSubmit={handleSearch}
              className="flex items-center gap-2 rounded-full border border-line bg-white px-4 focus-within:border-clay"
            >
              <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dresses, shirts, shoes…"
                aria-label="Search products"
                autoComplete="off"
                maxLength={80}
                className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-ink px-5 py-2 text-sm font-medium text-canvas transition-colors hover:bg-clay"
              >
                Search
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">Popular:</span>
              {QUICK_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  onClick={closeSearch}
                  className="rounded-full border border-line px-3 py-1 font-medium transition-colors hover:border-ink hover:bg-ink hover:text-canvas"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-canvas p-6 shadow-xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-xl font-semibold">
              {siteConfig.name}
              <span className="text-clay">.</span>
            </span>
            <IconButton label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={22} strokeWidth={1.75} />
            </IconButton>
          </div>

          <nav aria-label="Mobile" className="mt-10 flex-1">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-line py-4 font-display text-2xl transition-colors hover:text-clay"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-3 border-t border-line pt-6">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line py-3 text-sm font-medium transition-colors hover:bg-sand"
            >
              <User size={18} /> Account
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-line py-3 text-sm font-medium transition-colors hover:bg-sand"
            >
              <Heart size={18} /> Wishlist
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}