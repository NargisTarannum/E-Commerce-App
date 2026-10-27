import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Categories({ categories }) {
  if (!categories?.length) return null;

  return (
    <section
      id="categories"
      aria-labelledby="categories-title"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <SectionHeading
        id="categories-title"
        eyebrow="Shop by category"
        title="Find your style"
        description="From everyday essentials to statement pieces."
      />

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
        {categories.map((category, index) => {
          const isLead = index === 0;
          return (
            <li
              key={category.slug}
              className={isLead ? "col-span-2 row-span-2" : ""}
            >
              <Link
                href={category.href}
                className={`group relative block h-full overflow-hidden rounded-3xl bg-sand ${
                  isLead
                    ? "min-h-[22rem] sm:min-h-[28rem] lg:min-h-0"
                    : "min-h-[13rem] sm:min-h-[15rem]"
                }`}
              >
                <SafeImage
                  src={category.image}
                  alt=""
                  fill
                  sizes={
                    isLead
                      ? "(min-width: 1024px) 50vw, 100vw"
                      : "(min-width: 1024px) 25vw, 50vw"
                  }
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/5 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-6">
                  <div>
                    <h3
                      className={`font-display font-medium leading-tight ${
                        isLead ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
                      }`}
                    >
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/80 sm:text-sm">
                      {category.count} styles
                    </p>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-canvas text-ink transition-all duration-300 group-hover:bg-clay group-hover:text-white">
                    <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
                    <span className="sr-only">Shop {category.name}</span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
