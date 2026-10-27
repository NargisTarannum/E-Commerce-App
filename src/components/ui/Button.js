import Link from "next/link";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 active:scale-[0.98]";

const variants = {
  primary: "bg-ink text-canvas hover:bg-clay",
  accent: "bg-clay text-white hover:bg-clay-dark",
  outline:
    "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-canvas",
  light: "bg-canvas text-ink hover:bg-white",
};

export default function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}