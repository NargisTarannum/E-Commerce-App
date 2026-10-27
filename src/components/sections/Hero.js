import { ArrowRight, RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import SafeImage from "@/components/ui/SafeImage";
import { heroContent } from "@/lib/data";

export default function Hero() {
  const { eyebrow, title, description, image, imageAlt, badge, primaryCta, secondaryCta } =
    heroContent;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-24 lg:pt-16">
        {/* Copy */}
        <div className="lg:col-span-6">
          <p
            className="animate-fade-up text-xs font-medium uppercase tracking-[0.25em] text-clay"
          >
            {eyebrow}
          </p>
          <h1
            id="hero-title"
            style={{ animationDelay: "100ms" }}
            className="animate-fade-up mt-5 font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {title}
          </h1>
          <p
            style={{ animationDelay: "200ms" }}
            className="animate-fade-up mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg"
          >
            {description}
          </p>
          <div
            style={{ animationDelay: "300ms" }}
            className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button href={primaryCta.href} className="group px-7 py-3.5">
              {primaryCta.label}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Button>
            <Button href={secondaryCta.href} variant="outline" className="px-7 py-3.5">
              {secondaryCta.label}
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="relative isolate mx-auto w-full max-w-md lg:col-span-6 lg:ml-auto lg:max-w-lg">
          <div
            aria-hidden="true"
            className="absolute -right-6 top-12 -z-10 h-44 w-44 rounded-full bg-clay/15 sm:-right-10 sm:h-56 sm:w-56"
          />
          <div
            style={{ animationDelay: "150ms" }}
            className="animate-fade-up relative aspect-[4/5] overflow-hidden rounded-b-3xl rounded-t-full bg-sand"
          >
            <SafeImage
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 512px, 90vw"
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-8 left-2 flex max-w-[15rem] items-center gap-3 rounded-2xl border border-line bg-canvas/95 p-4 shadow-lg backdrop-blur sm:-left-8">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-clay">
              <RotateCcw size={18} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">{badge.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted">{badge.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}