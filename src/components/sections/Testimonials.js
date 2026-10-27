import { Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Testimonials({ items }) {
  if (!items?.length) return null;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="my-16 bg-ink text-canvas lg:my-24"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Customer love"
          title="Loved by people who wear it"
          light
        />

        <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-6">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors duration-300 hover:bg-white/10"
            >
              <div
                className="flex gap-0.5"
                role="img"
                aria-label={`Rated ${item.rating} out of 5`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    aria-hidden="true"
                    className={
                      i < Math.round(item.rating)
                        ? "fill-clay text-clay"
                        : "text-white/25"
                    }
                  />
                ))}
              </div>

              <blockquote className="mt-5 flex-1 font-display text-xl leading-snug">
                “{item.quote}”
              </blockquote>

              <figcaption className="mt-8 border-t border-white/10 pt-5 text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="mt-0.5 text-canvas/60">
                  Verified buyer · {item.product}
                </p>
              </figcaption>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}