"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white">
      <div className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <h1 className="text-xl font-bold">Shop</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart</Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-3 p-4 bg-gray-800">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart</Link>
        </div>
      )}
    </nav>
  );
}