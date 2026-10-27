"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 z-50
                 w-12 h-12
                 rounded-full
                 bg-gray-400
                 flex items-center justify-center
                 shadow-lg
                 hover:bg-gray-500
                 transition-all duration-300"
      aria-label="Scroll to top"
    >
      <span className="text-3xl font-bold leading-none">
        ↑
      </span>
    </button>
  );
}