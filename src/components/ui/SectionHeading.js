export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  light = false,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        {eyebrow && (
          <p
            className={`text-xs font-medium uppercase tracking-[0.2em] ${
              light ? "text-canvas/60" : "text-clay"
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl"
        >
          {title}
        </h2>
        {description && (
          <p className={`mt-3 ${light ? "text-canvas/70" : "text-muted"}`}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}