import Link from "next/link";
import { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";
import { LegalFooter } from "@/components/legal-footer";
import { navItems } from "@/lib/mock-data";

type AppShellProps = {
  agencyName: string;
  title: string;
  description: string;
  basePath: string;
  activeTab?: string;
  children: ReactNode;
};

export function AppShell({
  agencyName,
  title,
  description,
  basePath,
  activeTab,
  children,
}: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-4 px-3 py-3 sm:gap-6 sm:px-6 sm:py-4 lg:px-8">
      <aside className="sidebar-panel sticky top-4 hidden h-[calc(100vh-2rem)] w-[298px] shrink-0 overflow-y-auto rounded-[2rem] p-5 lg:block">
        <div>
          <BrandMark compact dark href="/" />
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgba(16,207,194,0.18)] bg-[rgba(16,207,194,0.08)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[rgba(226,252,248,0.95)]">
            <span className="status-dot" />
            Operation hub
          </div>
          <h1 className="mt-4 text-[2rem] font-semibold tracking-tight text-white">
            {agencyName}
          </h1>
          <p className="sidebar-text mt-3 text-sm leading-7">
            Musteri, police ve operasyon akislarini tek merkezden yonetin.
          </p>
        </div>

        <div className="sidebar-divider mt-7" />

        <nav className="mt-7 space-y-2" aria-label="Ana menu">
          <Link
            href="/giris"
            className="sidebar-nav-link"
          >
            Panele geri don
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={`${basePath}${item.href}`}
              className={`sidebar-nav-link ${activeTab && item.href.includes(`tab=${activeTab}`) ? "sidebar-nav-link-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-5 rounded-[1.6rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/55">Quick access</p>
          <p className="mt-2 text-lg font-semibold">Gunluk kullanim</p>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>En sik kullanilan iki ekrana hizli gecis.</p>
            <div className="flex flex-col gap-2">
              <Link href={`${basePath}?tab=customers`} className="sidebar-nav-link text-sm">
                Musteriler
              </Link>
              <Link href={`${basePath}?tab=operations`} className="sidebar-nav-link text-sm">
                Operasyon
              </Link>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 pb-28 sm:pb-32 lg:pb-6">
        <header className="panel-card rounded-[1.8rem] p-5 sm:rounded-[2.2rem] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <BrandMark compact href="/" />
              <p className="eyebrow mt-1">
                {agencyName}
              </p>
              <h1 className="mt-3 max-w-[12ch] text-[2.1rem] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[3rem]">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
                {description}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/giris"
                className="secondary-button text-center"
              >
                Kurum girisi
              </Link>
              <Link
                href={`${basePath}?tab=policies`}
                className="cta-button text-center"
              >
                Yeni police kaydi
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-6">{children}</div>
        <div className="mt-6">
          <LegalFooter />
        </div>

        <nav
          aria-label="Mobil menu"
          className="panel-card fixed bottom-3 left-3 right-3 z-20 mx-auto grid max-w-3xl grid-cols-4 gap-2 rounded-[1.5rem] p-2.5 lg:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={`${basePath}${item.href}`}
              className={`rounded-xl px-2 py-2.5 text-center text-[11px] font-semibold leading-tight ${activeTab && item.href.includes(`tab=${activeTab}`) ? "bg-[var(--color-strong)] text-white" : "bg-white text-[var(--color-ink)]"}`}
            >
              {item.shortLabel}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
