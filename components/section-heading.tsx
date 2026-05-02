type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-gold)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
        {title}
      </h2>
      <div className="mt-3 h-px w-20 bg-[linear-gradient(90deg,var(--color-gold),transparent)]" />
      <p className="mt-4 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
        {description}
      </p>
    </div>
  );
}
