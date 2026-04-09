import Link from "next/link";
import { getAgencySummaries } from "@/lib/data";

export default async function Home() {
  const { agencies, source } = await getAgencySummaries();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="hero-panel overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(8,34,61,0.94),rgba(13,74,108,0.92)_48%,rgba(184,92,56,0.9))] p-6 text-white shadow-[0_32px_80px_rgba(12,39,56,0.22)] sm:p-8 lg:p-10">
        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-white/80">
          Multi-Tenant Sigorta CRM
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Simdilik 2 acentenin kullandigi, ileride kolayca buyuyebilecek panel
          yapisi.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
          Her acente kendi musterileri, policeleri, lead akisi, personeli ve PDF
          arsivi ile ayrik sekilde calisir. Ustte tek platform, altta tenant bazli
          veri izolasyonu mantigi bulunur.
        </p>
        <p className="mt-4 text-sm text-white/70">
          Veri kaynagi: {source === "supabase" ? "Supabase canli veri" : "Demo veri"}
        </p>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Acentalar
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
            Aktif 2 acente
          </h2>
          <div className="mt-8 grid gap-4">
            {agencies.map((agency) => (
              <Link
                key={agency.slug}
                href={`/acente/${agency.slug}`}
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/85 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(18,38,52,0.08)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color-ink)]">
                      {agency.name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {agency.city} / {agency.themeLabel}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--color-chip)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-strong)]">
                    {agency.users}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-[var(--color-muted)] sm:grid-cols-2">
                  <p>Urunler: {agency.products}</p>
                  <p className="font-semibold text-[var(--color-ink)]">
                    Aylik prim: {agency.monthlyPremium}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel-card rounded-[2rem] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Mimari
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
              Coklu acente mantigi
            </h2>
            <div className="mt-8 grid gap-4">
              {[
                "Her kayitta agency_id olacak: musteri, police, lead, mesaj, personel, PDF.",
                "Kullanici girisinde role ek olarak agency_id tutulacak.",
                "Super admin tum acenteleri gorur, acente yoneticisi sadece kendi tenant'ini gorur.",
                "Raporlar ve bildirimler tenant bazinda filtrelenecek.",
              ].map((item) => (
                <article
                  key={item}
                  className="rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-soft)] p-5 text-sm leading-7 text-[var(--color-muted)]"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>

          <div className="panel-card rounded-[2rem] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Sonraki adim
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
              Uretime gecis yolu
            </h2>
            <div className="mt-6 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
              <p>1. Ilk etapta 2 acente icin `agencies`, `users`, `customers`, `policies`, `leads` tablolarini tenant bazli kur.</p>
              <p>2. Rol yetkisini `super_admin`, `agency_admin`, `sales`, `operations` olarak ayir.</p>
              <p>3. Her sorguda acente filtresi uygula; yeni acente acmak ise sadece yeni tenant eklemek kadar kolay olsun.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
