import Link from "next/link";
import { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";
import { navItems } from "@/lib/mock-data";

type AppShellProps = {
  agencyName: string;
  title: string;
  description: string;
  basePath: string;
  children: ReactNode;
};

export function AppShell({
  agencyName,
  title,
  description,
  basePath,
  children,
}: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-4 px-3 py-3 sm:gap-6 sm:px-6 sm:py-4 lg:px-8">
      <aside className="panel-card sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col rounded-[2rem] p-5 lg:flex">
        <div>
          <BrandMark compact dark href="/" />
          <h1 className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
            {agencyName}
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Musteri, police, lead, ekip ve belge surecleri tek merkezli operasyon mantigiyla yonetilir.
          </p>
        </div>

        <nav className="mt-8 space-y-2" aria-label="Ana menu">
          <Link
            href="/"
            className="block rounded-2xl border border-[var(--color-line)] bg-[rgba(15,23,42,0.6)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-line-strong)]"
          >
            ADN ana ekrana don
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={`${basePath}${item.href}`}
              className="block rounded-2xl border border-[var(--color-line)] bg-white/5 px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-line-strong)] hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/55">
            Kisa yol
          </p>
          <p className="mt-2 text-lg font-semibold">Hizli operasyon gecisi</p>
          <div className="mt-4 space-y-2">
            <Link
              href={`${basePath}#musteri-yonetimi`}
              className="block rounded-xl border border-white/10 px-3 py-2 text-sm text-white/78 transition hover:bg-white/8"
            >
              Musteri kayitlarini yonet
            </Link>
            <Link
              href={`${basePath}#operasyon`}
              className="block rounded-xl border border-white/10 px-3 py-2 text-sm text-white/78 transition hover:bg-white/8"
            >
              Belge ve gorev alanina git
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 pb-28 sm:pb-32 lg:pb-6">
        <header className="panel-card rounded-[1.6rem] p-4 sm:rounded-[2rem] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <BrandMark compact href="/" />
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-gold)]">
                {agencyName}
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)] sm:text-base sm:leading-7">
                {description}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/giris"
                className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-center text-sm font-semibold text-[var(--color-ink)]"
              >
                Giris yap
              </Link>
              <Link
                href={`${basePath}#police-yonetimi`}
                className="rounded-full bg-[var(--color-strong)] px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Yeni police kaydi
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-6">{children}</div>

        <nav
          aria-label="Mobil menu"
          className="panel-card fixed bottom-3 left-3 right-3 z-20 mx-auto grid max-w-3xl grid-cols-4 gap-2 rounded-[1.35rem] p-2.5 lg:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={`${basePath}${item.href}`}
              className="rounded-xl bg-white/80 px-2 py-2.5 text-center text-[11px] font-semibold leading-tight text-[var(--color-ink)]"
            >
              {item.shortLabel}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
