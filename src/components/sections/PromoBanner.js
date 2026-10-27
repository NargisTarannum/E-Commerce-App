import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import SafeImage from "@/components/ui/SafeImage";
import { promoContent } from "@/lib/data";

export default function PromoBanner() {
  const { eyebrow, title, description, image, imageAlt, cta } = promoContent;

  return (
    <section
      id="promo"
      aria-labelledby="promo-title"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
    >
      <div className="grid overflow-hidden rounded-3xl bg-clay text-white md:grid-cols-2">
        <div className="flex flex-col items-start justify-center gap-5 p-8 sm:p-12 lg:p-16">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/75">
            {eyebrow}
          </p>
          <h2
            id="promo-title"
            className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
          <p className="max-w-sm text-white/85">{description}</p>
          <Button href={cta.href} variant="light" className="group mt-2 px-7 py-3.5">
            {cta.label}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Button>
        </div>

        <div className="relative min-h-72 md:min-h-[26rem]">
          <SafeImage
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}