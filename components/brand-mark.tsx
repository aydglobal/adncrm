import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = {
  compact?: boolean;
  href?: string;
  priority?: boolean;
  dark?: boolean;
};

export function BrandMark({
  compact = false,
  href = "/",
  priority = false,
  dark = false,
}: BrandMarkProps) {
  const content = (
    <>
      <div
        className={`relative overflow-hidden rounded-[1.25rem] border ${
          dark
            ? "border-white/12 bg-white/6 shadow-[0_18px_50px_rgba(2,6,23,0.55)]"
            : "border-[var(--color-line)] bg-white/8 shadow-[0_18px_50px_rgba(2,6,23,0.38)]"
        } ${compact ? "h-12 w-12" : "h-14 w-14 sm:h-16 sm:w-16"}`}
      >
        <Image
          src="/adnlogo.png"
          alt="ADN Trust"
          fill
          priority={priority}
          className="object-cover"
          sizes={compact ? "48px" : "64px"}
        />
      </div>

      <div className="min-w-0">
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.38em] ${
            dark ? "text-[color:var(--color-gold)]" : "text-[color:var(--color-gold)]"
          }`}
        >
          ADN TRUST
        </p>
        <p
          className={`truncate text-lg font-semibold tracking-tight ${
            dark ? "text-white" : "text-[var(--color-ink)]"
          } ${compact ? "text-base" : "sm:text-xl"}`}
        >
          ADN CRM Suite
        </p>
        {!compact ? (
          <p className={`mt-1 text-xs tracking-[0.18em] ${dark ? "text-white/55" : "text-[var(--color-muted)]"}`}>
            SIGORTA OPERASYON PLATFORMU
          </p>
        ) : null}
      </div>
    </>
  );

  if (!href) {
    return <div className={`inline-flex items-center gap-3 ${compact ? "" : "sm:gap-4"}`}>{content}</div>;
  }

  return (
    <Link href={href} className={`inline-flex items-center gap-3 ${compact ? "" : "sm:gap-4"}`}>
      {content}
    </Link>
  );
}
