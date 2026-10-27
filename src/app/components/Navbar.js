"use client";
// import { useState } from "react";
import Link from "next/link";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);

//   return (
//     <nav className="bg-gray-900 text-white">
//       <div className="flex justify-between items-center p-4 max-w-6xl mx-auto">
//         <h1 className="text-xl font-bold">Shop</h1>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex gap-6">
//           <Link href="/">Home</Link>
//           <Link href="/cart">Cart</Link>
//         </div>

//         {/* Mobile Button */}
//         <button
//           className="md:hidden"
//           onClick={() => setOpen(!open)}
//         >
//           ☰
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {open && (
//         <div className="md:hidden flex flex-col gap-3 p-4 bg-gray-800">
//           <Link href="/">Home</Link>
//           <Link href="/cart">Cart</Link>
//         </div>
//       )}
//     </nav>
//   );
// }

import {
  Search,
  User,
  ShoppingCart,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
   const { theme, setTheme } = useTheme();
  return (
    <nav className="shadow-md h-20 flex items-center justify-between px-10 bg-white text-black dark:bg-gray-900 dark:text-white">

    <Link className="text-5xl font-bold" href="/">Shopify</Link>

      <div className="flex">

        <input
          type="text"
          placeholder="apple..."
          className="border border-blue-500 w-[300px] h-12 px-4 rounded-l-md outline-none"
        />

        <button className="bg-blue-500 w-16 flex items-center justify-center rounded-r-md hover:bg-blue-600 transition-colors">
          <Search color="white" />
        </button>

      </div>

      <div className="flex items-center gap-10">

        <a href="#" className="text-xl">Products</a>

        <a href="#" className="text-xl">Categories</a>

        <User size={28} />

        <div className="relative">

          <ShoppingCart size={30} />

          <span className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            0
          </span>

        </div>

        <button
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
          className="cursor-pointer"
        >
          {theme === "dark" ? <Sun size={30} /> : <Moon size={30} />}
        </button>

      </div>

    </nav>
  );
}