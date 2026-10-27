import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ProductGrid({ id, eyebrow, title, description, items }) {
  if (!items?.length) return null;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <SectionHeading
        id={`${id}-title`}
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
        {items.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}