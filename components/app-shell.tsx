import Link from "next/link";
import { ReactNode } from "react";
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
    <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
      <aside className="panel-card sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col rounded-[2rem] p-5 lg:flex">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Multi-Acente CRM
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
            {agencyName}
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Her acente kendi verisi, ekibi, police portfoyu ve operasyon akisiyla
            ayrik sekilde calisir.
          </p>
        </div>

        <nav className="mt-8 space-y-2" aria-label="Ana menu">
          <Link
            href="/"
            className="block rounded-2xl border border-transparent bg-[var(--color-soft)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-line)]"
          >
            Acenta listesine don
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={`${basePath}${item.href}`}
              className="block rounded-2xl border border-transparent bg-white/70 px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-line)] hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-[1.5rem] bg-[var(--color-strong)] p-5 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/60">
            Tenant mantigi
          </p>
          <p className="mt-2 text-xl font-semibold">Ayrik veri ve rol yapisi</p>
          <p className="mt-3 text-sm leading-6 text-white/74">
            Sonraki adimda her kayda `agency_id` baglayip yetkiyi acente bazinda
            kilitleyebiliriz.
          </p>
        </div>
      </aside>

      <div className="flex-1 pb-24 lg:pb-6">
        <header className="panel-card rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                {agencyName}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/giris"
                className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                Giris yap
              </Link>
              <button className="rounded-full bg-[var(--color-strong)] px-5 py-3 text-sm font-semibold text-white">
                Yeni police kaydi
              </button>
            </div>
          </div>
        </header>

        <div className="mt-6">{children}</div>

        <nav
          aria-label="Mobil menu"
          className="panel-card fixed bottom-4 left-4 right-4 z-20 mx-auto grid max-w-3xl grid-cols-3 gap-2 rounded-[1.5rem] p-3 lg:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={`${basePath}${item.href}`}
              className="rounded-xl bg-white/80 px-3 py-2 text-center text-xs font-semibold text-[var(--color-ink)]"
            >
              {item.shortLabel}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
