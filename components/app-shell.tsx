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
      <aside className="panel-card sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col rounded-[2rem] p-5 lg:flex">
        <div>
          <BrandMark compact dark href="/" />
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgba(209,165,92,0.22)] bg-[rgba(209,165,92,0.08)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent-strong)]">
            <span className="status-dot" />
            ADN kurumsal panel
          </div>
          <h1 className="display-title mt-4 text-[2rem] font-semibold text-[var(--color-ink)]">
            {agencyName}
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Musteri, police, lead, ekip ve belge surecleri tek merkezli operasyon mantigiyla yonetilir.
          </p>
        </div>

        <nav className="mt-8 space-y-2" aria-label="Ana menu">
          <Link
            href="/giris"
            className="nav-rail-link bg-[rgba(255,255,255,0.06)]"
          >
            Giris ekranina don
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={`${basePath}${item.href}`}
              className={`nav-rail-link ${activeTab && item.href.includes(`tab=${activeTab}`) ? "bg-[rgba(209,165,92,0.12)] border-[var(--color-line-strong)]" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto gold-sheen rounded-[1.6rem] p-5 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/55">Bugunun odagi</p>
          <p className="mt-2 text-xl font-semibold">Hizli operasyon gecisi</p>
          <div className="mt-4 space-y-3 text-sm text-white/78">
            <p>Musteri kartlari, police yenilemeleri ve operasyon kayitlari tek akista.</p>
            <div className="flex flex-col gap-2">
              <Link href={`${basePath}?tab=customers`} className="secondary-button text-sm">
                Musteri kayitlarini yonet
              </Link>
              <Link href={`${basePath}?tab=operations`} className="secondary-button text-sm">
                Belge ve gorev alanina git
              </Link>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 pb-28 sm:pb-32 lg:pb-6">
        <header className="hero-stage panel-card rounded-[1.8rem] p-4 sm:rounded-[2.2rem] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <BrandMark compact href="/" />
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-gold)]">
                {agencyName}
              </p>
              <h1 className="display-title mt-3 text-[2.2rem] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[3.2rem]">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)] sm:text-base sm:leading-7">
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
              className={`rounded-xl px-2 py-2.5 text-center text-[11px] font-semibold leading-tight ${activeTab && item.href.includes(`tab=${activeTab}`) ? "bg-[var(--color-strong)] text-white" : "bg-white/90 text-[var(--color-ink)]"}`}
            >
              {item.shortLabel}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
