import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { getAgencySummaries } from "@/lib/data";

export default async function Home() {
  const { agencies, source } = await getAgencySummaries();
  const primaryAgency = agencies[0];

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-3 py-3 sm:px-6 sm:py-6 lg:px-8">
      <section className="hero-panel glow-card ledger-grid overflow-hidden rounded-[1.9rem] p-4 text-white sm:rounded-[2.75rem] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-center lg:gap-12">
          <div className="reveal">
            <BrandMark dark priority href="/" />
            <p className="executive-chip mt-5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.26em] sm:px-4 sm:text-xs sm:tracking-[0.34em]">
              ADN Grup Sigorta Executive Console
            </p>
            <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">
              Kurumsal sigorta operasyonunu tek bakista yoneten premium ADN paneli.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8">
              Musteri portfoyu, police yenilemeleri, sicak lead akisi, ic ekip koordinasyonu
              ve belge arsivi ayni merkezde. Karar alan yoneticiler ve sahadaki ekipler icin
              hizli, guvenli ve net bir operasyon yuzeyi.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { title: "Yanıt suresi", value: "7 dk", note: "Lead geri donus hizi" },
                { title: "Aylik uretim", value: "₺4,8 Mn", note: "Prim hacmi" },
                { title: "Aktif ekip", value: "12 kisi", note: "Satis ve operasyon" },
              ].map((stat) => (
                <article
                  key={stat.title}
                  className="rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-sm"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                    {stat.title}
                  </p>
                  <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/65">{stat.note}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/giris"
                className="accent-ring rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900"
              >
                Yonetim paneline gir
              </Link>
              <Link
                href={primaryAgency ? `/acente/${primaryAgency.slug}` : "/giris"}
                className="rounded-full border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white/85 transition hover:bg-white/10"
              >
                Veri kaynagi: {source === "supabase" ? "Canli" : "Demo"}
              </Link>
              <Link
                href={primaryAgency ? `/acente/${primaryAgency.slug}#kayit-merkezi` : "/giris"}
                className="rounded-full border border-[color:var(--color-gold)]/35 bg-[color:var(--color-gold-soft)] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[rgba(216,179,106,0.18)]"
              >
                Operasyon merkezini ac
              </Link>
            </div>
          </div>

          <div className="reveal rounded-[1.8rem] border border-white/10 bg-white/5 p-4 sm:rounded-[2.25rem] sm:p-5">
            <div className="grid gap-4">
              <div className="gold-sheen rounded-[1.5rem] p-5">
                <p className="text-xs uppercase tracking-[0.26em] text-white/55">
                  Yönetici Özeti
                </p>
                <p className="mt-3 text-3xl font-semibold">98 aktif police</p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  Bugun 14 yeni lead, 6 yenileme gorusmesi ve 4 belge yukleme hareketi
                  goruluyor.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid-sheen rounded-[1.5rem] border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                    Portföy dengesi
                  </p>
                  <p className="mt-3 text-2xl font-semibold">Kurumsal %61</p>
                </div>
                <div className="grid-sheen rounded-[1.5rem] border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                    Yenileme yoğunluğu
                  </p>
                  <p className="mt-3 text-2xl font-semibold">12 kritik dosya</p>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(29,155,240,0.18),rgba(7,17,31,0.3),rgba(216,179,106,0.14))] p-5">
                <p className="text-sm font-semibold text-white/80">Kullanım modeli</p>
                <p className="mt-2 text-3xl font-semibold">Tek kurum, tek merkez, tam kontrol</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel-card rounded-[1.6rem] p-4 sm:rounded-[2.25rem] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-gold)]">
            Kurum Profili
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
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-gold)]">
              Yönetim Yapısı
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">
              Guvenli ve kontrol edilebilir akış
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
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-gold)]">
              Geçiş Planı
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
