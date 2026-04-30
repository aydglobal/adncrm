import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { getAgencySummaries } from "@/lib/data";

export default async function Home() {
  const { agencies, source } = await getAgencySummaries();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-3 py-3 sm:px-6 sm:py-6 lg:px-8">
      <section className="hero-panel glow-card overflow-hidden rounded-[1.9rem] p-4 text-white sm:rounded-[2.75rem] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
          <div className="reveal">
            <BrandMark dark priority href="/" />
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white/80 sm:px-4 sm:text-xs sm:tracking-[0.32em]">
              ADN Grup Sigorta Command Center
            </p>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">
              ADN Grup Sigorta icin premium, canliya hazir operasyon platformu.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:mt-6 sm:text-lg sm:leading-8">
              Musteri, police, lead, ekip ve evrak akisi tek ekranda. ADN Grup Sigorta
              markasi altinda hizli karar icin tum ozetler tek bakista.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/giris"
                className="accent-ring rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900"
              >
                Giris yap
              </Link>
              <Link
                href={agencies[0] ? `/acente/${agencies[0].slug}` : "/giris"}
                className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                Veri kaynagi: {source === "supabase" ? "Canli" : "Demo"}
              </Link>
              <Link
                href={agencies[0] ? `/acente/${agencies[0].slug}#kayit-merkezi` : "/giris"}
                className="rounded-full border border-sky-300/30 bg-sky-400/10 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-400/20"
              >
                Kayit merkezine git
              </Link>
            </div>
          </div>

          <div className="reveal rounded-[1.6rem] border border-white/10 bg-white/5 p-4 sm:rounded-[2.25rem] sm:p-5">
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
                <p className="text-sm font-semibold">Operasyon yapisi</p>
                <p className="mt-2 text-3xl font-semibold">1 aktif kurum paneli</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel-card rounded-[1.6rem] p-4 sm:rounded-[2.25rem] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Kurum
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
            ADN Grup Sigorta
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

        <div className="space-y-4 sm:space-y-6">
          <div className="panel-card rounded-[1.6rem] p-4 sm:rounded-[2.25rem] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Operasyon yapisi
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
              Tek merkezli canli kullanim
            </h2>
            <div className="mt-8 grid gap-4">
              {[
                {
                  text: "Tum musteri, police, lead ve belge akisi ADN Grup Sigorta catisinda yonetilir.",
                  href: agencies[0] ? `/acente/${agencies[0].slug}#genel-bakis` : "/giris",
                },
                {
                  text: "Tek kullanici girisiyle merkez operasyon paneli acilir.",
                  href: "/giris",
                },
                {
                  text: "Yetkisiz kullanici farkli tenant ya da farkli kurum ekrani acamaz.",
                  href: agencies[0] ? `/acente/${agencies[0].slug}#ekip` : "/giris",
                },
                {
                  text: "Canli kullanimda RLS ve oturum kontrolu ayni cizgide korunur.",
                  href: agencies[0] ? `/acente/${agencies[0].slug}#operasyon` : "/giris",
                },
              ].map((item) => (
                <Link
                  key={item.text}
                  href={item.href}
                  className="rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-soft)] p-5 text-sm leading-7 text-[var(--color-muted)] transition hover:-translate-y-0.5 hover:border-[var(--color-line-strong)]"
                >
                  {item.text}
                </Link>
              ))}
            </div>
          </div>

          <div className="panel-card rounded-[1.6rem] p-4 sm:rounded-[2.25rem] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
              Sonraki adim
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
              Canli kullanim plani
            </h2>
            <div className="mt-6 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
              <p>1. ADN Grup Sigorta ekibi icin kullanici, musteri, police, lead ve belge tablolarini canli veriyle senkronize et.</p>
              <p>2. Rol dagilimini yonetici, satis, yenileme ve operasyon olacak sekilde netlestir.</p>
              <p>3. Evrak yukleme, yenileme gorevleri ve satis takip akisini tek panelden yonetilecek hale getir.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/giris"
                className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                Giris ekranina git
              </Link>
              <Link
                href={agencies[0] ? `/acente/${agencies[0].slug}#police-yonetimi` : "/giris"}
                className="rounded-full bg-[var(--color-strong)] px-5 py-3 text-sm font-semibold text-white"
              >
                Police yonetimini ac
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
