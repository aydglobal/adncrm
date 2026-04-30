import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { getAgencySummaries } from "@/lib/data";

export default async function Home() {
  const { agencies, source } = await getAgencySummaries();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="hero-panel glow-card overflow-hidden rounded-[2.75rem] p-6 text-white sm:p-8 lg:p-10">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="reveal">
            <BrandMark dark priority href="/" />
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.32em] text-white/80">
              Sigorta Operasyon Command Center
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              ADN Trust icin premium, canliya hazir acente operasyon platformu.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Musteri, police, lead, ekip ve evrak akisi tek ekranda. Her acente kendi
              verisini gorur; ADN markasi altinda hizli karar icin tum ozetler tek bakista.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/giris"
                className="accent-ring rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
              >
                Giris yap
              </Link>
              <span className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80">
                Veri kaynagi: {source === "supabase" ? "Canli" : "Demo"}
              </span>
            </div>
          </div>

          <div className="reveal rounded-[2.25rem] border border-white/10 bg-white/5 p-5">
            <div className="grid gap-4">
              <div className="grid-sheen rounded-[1.5rem] border border-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.26em] text-white/60">
                  Canli Operasyon Ozet
                </p>
                <p className="mt-3 text-3xl font-semibold">98 aktif police</p>
                <p className="mt-2 text-sm text-white/70">
                  Bugun 14 yeni lead, 6 yenileme gorusmesi.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid-sheen rounded-[1.5rem] border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                    Lead Hizi
                  </p>
                  <p className="mt-3 text-2xl font-semibold">7 dk</p>
                </div>
                <div className="grid-sheen rounded-[1.5rem] border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                    Yenileme
                  </p>
                  <p className="mt-3 text-2xl font-semibold">12 riskli</p>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-r from-sky-500/20 via-slate-900/30 to-emerald-500/20 p-5">
                <p className="text-sm font-semibold">Acenta sayisi</p>
                <p className="mt-2 text-3xl font-semibold">2 aktif tenant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel-card rounded-[2.25rem] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Acentalar
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
            ADN aginda aktif 2 acente
          </h2>
          <div className="mt-8 grid gap-4">
            {agencies.map((agency) => (
              <Link
                key={agency.slug}
                href={`/acente/${agency.slug}`}
                className="premium-card rounded-[1.75rem] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(2,6,23,0.7)]"
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
          <div className="panel-card rounded-[2.25rem] p-6 sm:p-8">
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

          <div className="panel-card rounded-[2.25rem] p-6 sm:p-8">
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
